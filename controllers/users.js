const { User, Notification, RefreshToken , sequelize} = require('../models');
const { sendAccountCreationEmail, sendPasswordResetEmail, sendResetSuccessEmail } = require('../mails/email');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const LocalStrategy = require('passport-local').Strategy;
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const dotenv = require('dotenv');
const { Op } = require('sequelize');
const { nanoid } = require('nanoid');
const {ArchiveService} = require('../services/auditTrail')



dotenv.config();

// Passport configuration
passport.use(
  new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'User not found' });
        }

        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) return done(err);
          if (isMatch) return done(null, user);
          else return done(null, false, { message: 'Password incorrect' });
        });
      })
      .catch(error => done(error));
  })
);



// Configure JWT strategy
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_KEY,
    },
    async (jwt_payload, done) => {
      try {
        const user = await User.findOne({ where: { uuid: jwt_payload.userId } });
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

// Generate JWT token
function generateToken(user) {
  return jwt.sign(
    {
      userId: user.uuid,
      type: user.type,
      isApproved: user.isApproved,
      isDefaultPassword: user.isDefaultPassword,
      role: user.role,
    },
    process.env.SECRET_KEY,
    { expiresIn: '20m' }
  );
}

// Generate a refresh token
async function generateRefreshToken(user) {
  const token = crypto.randomBytes(40).toString('hex');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await RefreshToken.create({ token, userId: user.uuid, expiresAt });

  return token;
}

const generateRandomPassword = () => {
  return nanoid(12); // Generates a 12-character random string
};
const SEVEN_DAYS = 1000 * 60 * 60 * 24 * 7;

// Sign UpsendPasswordResetEmail
module.exports.signUp = async (req, res) => {
  const userId = req.userId;
  // console.log(userId)
  const { firstName, lastName, email, gender, phoneNumber, idNumber, dateJoined, password, role, confirmPassword } = req.body;

  try {
    let isApproved = false;
    let isDefaultPassword = false;
    let hashedPassword;
    let defaultPassword = null;

    if (userId) {
      const admin = await User.findOne({ where: { uuid: userId } });

      if (!admin) {
        return res.status(404).json({ message: 'Admin user not found' });
      }

      if (admin.role === 'Admin') {
        isApproved = true;
        isDefaultPassword = true;
        const defaultPassword = generateRandomPassword();
        hashedPassword = await bcrypt.hash(defaultPassword, 10);
      } else {
        return res.status(403).json({ message: 'Only Admins can create new users' });
      }
    } else {
      if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords1 do not match' });
      }
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      gender,
      phoneNumber,
      idNumber,
      dateJoined,
      password: hashedPassword,
      role,
      isApproved,
      isDefaultPassword,
    });

    if (isDefaultPassword) {
      await sendAccountCreationEmail(newUser.email, defaultPassword);
    }

    if (!isApproved) {
      await Notification.create({
        message: `New user pending approval: ${newUser.firstName} ${newUser.lastName} (${newUser.email})`,
        userId: newUser.uuid,
      });
    }

    res.status(201).json({ message: 'User created successfully.', user: newUser });
  } catch (error) {
    console.error('Error in signUp:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// Login
module.exports.login = async (req, res, next) => {
  passport.authenticate('local', { session: false }, async (err, user, info) => {
    if (err) return next(err);
    
    if (!user) {
      return res.status(201).json({ 
        success: false,
        message: 'Invalid credentials',
        error: 'INVALID_CREDENTIALS'
      });
    }

    
    if (!user.isApproved) {
      return res.status(202).json({ 
        success: false,
        message: 'Account approval required. Please contact administrator.',
        error: 'APPROVAL_REQUIRED',
        approvalRequired: true 
      });
    }

   
    const accessToken = generateToken(user);
    const refreshToken = await generateRefreshToken(user);
    
    
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: SEVEN_DAYS,
    });

   
    if (user.isDefaultPassword) {
      return res.status(200).json({
        success: true,
        message: 'Login successful but password change required',
        user,
        accessToken,
        refreshToken, 
        changePasswordRequired: true,
        requirePasswordChange: true
      });
    }


    res.status(200).json({ 
      success: true,
      message: 'Login successful',
      user,
      accessToken,
      refreshToken
    });
  })(req, res, next);
};

// Refresh Token
module.exports.refreshToken = async (req, res) => {

  console.log(req.cookies)
  try {
    // 1. Get the refreshToken from the cookie
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token missing' });
    }

    // 2. Validate the token in your DB
    const storedToken = await RefreshToken.findOne({ where: { token: refreshToken } });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      return res.status(401).json({ message: 'Refresh token is invalid or expired' });
    }

    // 3. Get the user
    const user = await User.findByPk(storedToken.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 4. Generate new access token
    const newAccessToken = generateToken(user);

    // 5. Generate new refresh token
    const newRefreshToken = await generateRefreshToken(user);

    // 6. Update the refresh token in the database
    await RefreshToken.update(
      { token: newRefreshToken, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },  // 7 days expiry
      { where: { token: refreshToken } }
    );

    // 7. Set the new refresh token in the HTTP-only cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days expiry
    });

    // 8. Respond with the new access token
    res.status(200).json({ accessToken: newAccessToken });

  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



// Forgot Password
module.exports.forgotPass = async (req, res) => {
  const { email } = req.body;

  const transaction = await sequelize.transaction(); // Start transaction

  try {
    const user = await User.findOne({ where: { email }, transaction });
    if (!user) {
      await transaction.rollback(); // Rollback if user is not found
      return res.status(404).json({ message: 'User not found.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = Date.now() + 3600000; // 1 hour
    await user.save({ transaction }); 

    const resetURL =  `${process.env.CLIENT_URL}/resetPassword/${resetToken}`

    await sendPasswordResetEmail(email,resetURL );

    await transaction.commit();

    res.status(200).json({ message: 'Reset email sent!' });
  } catch (error) {
    res.status(500).json({ message:error.message });
  }
};

// Reset Password
module.exports.resetPassword = async (req, res) => {
  const { resetPasswordToken } = req.params;
  const { password, confirmPassword } = req.body;

  try {
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const user = await User.findOne({
      where: {
        resetPasswordToken,
        resetPasswordExpiresAt: { [Op.gt]: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpiresAt = null;
    await user.save();

    await sendResetSuccessEmail(user.email);

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
module.exports.profile = async (req, res) => {
  try {
    const userData = await User.findOne({
      where: { uuid: req.user.uuid }});

    if (!userData) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(userData);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
};


module.exports.getPendingUsers = async (req, res) => {
  try {
    const pendingUsers = await User.findAll({
      where: { isApproved: false },
      attributes: ['uuid', 'firstName', 'lastName', 'email', 'role', 'dateJoined'],
    });

    return res.status(200).json(pendingUsers);
  } catch (error) {
    console.error("Error fetching pending users:", error);
    return res.status(500).json({ message: "Server error: " + error.message });
  }
};

module.exports.approveUser = async (req, res) => {
  const { id } = req.params; // User ID to approve

  try {
    const user = await User.findOne({ where: { uuid: id } });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.isApproved = true;
    await user.save();

    return res.status(200).json({ message: "User approved successfully." });
  } catch (error) {
    console.error("Error approving user:", error);
    return res.status(500).json({ message: "Server error: " + error.message });
  }
};



// Add this to your auth controller file

// Logout function
module.exports.logout = async (req, res) => {
  try {
    console.log("🚪 Logout request received");
    
    // Get the refresh token from the HTTP-only cookie
    const refreshToken = req.cookies?.refreshToken;
    
    if (refreshToken) {
      console.log("🔍 Found refresh token, removing from database");
      
      // Remove the refresh token from the database
      const deletedCount = await RefreshToken.destroy({
        where: { token: refreshToken }
      });
      
      console.log(`🗑️ Deleted ${deletedCount} refresh token(s) from database`);
    } else {
      console.log("⚠️ No refresh token found in cookies");
    }
    
    // Clear the refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      path: '/' // Make sure path matches the original cookie
    });
    
    console.log("🧹 Cleared refresh token cookie");
    
    // Return success response
    res.status(200).json({ 
      success: true,
      message: 'Logged out successfully' 
    });
    
  } catch (error) {
    console.error('❌ Error during logout:', error);
    
    // Even if there's an error, clear the cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      path: '/'
    });
    
    res.status(500).json({ 
      success: false,
      message: 'Logout failed, but session cleared locally',
      error: error.message 
    });
  }
};

// Optional: Logout from all devices function
module.exports.logoutAll = async (req, res) => {
  try {
    console.log("🚪🌍 Logout all devices request received");
    
    // Get user ID from the JWT token (req.user should be set by your auth middleware)
    const userId = req.user?.uuid;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }
    
    console.log(`🔍 Removing all refresh tokens for user: ${userId}`);
    
    // Remove ALL refresh tokens for this user from the database
    const deletedCount = await RefreshToken.destroy({
      where: { userId: userId }
    });
    
    console.log(`🗑️ Deleted ${deletedCount} refresh token(s) for user ${userId}`);
    
    // Clear the current refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      path: '/'
    });
    
    console.log("🧹 Cleared current refresh token cookie");
    
    res.status(200).json({ 
      success: true,
      message: `Logged out from all devices successfully. Removed ${deletedCount} active sessions.` 
    });
    
  } catch (error) {
    console.error('❌ Error during logout all:', error);
    
    // Clear the current cookie even if DB operation fails
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      path: '/'
    });
    
    res.status(500).json({ 
      success: false,
      message: 'Logout from all devices failed, but current session cleared',
      error: error.message 
    });
  }
};

// Optional: Clean up expired refresh tokens (utility function)
module.exports.cleanupExpiredTokens = async (req, res) => {
  try {
    console.log("🧹 Cleaning up expired refresh tokens");
    
    const deletedCount = await RefreshToken.destroy({
      where: {
        expiresAt: {
          [Op.lt]: new Date() // Less than current date (expired)
        }
      }
    });
    
    console.log(`🗑️ Cleaned up ${deletedCount} expired refresh tokens`);
    
    res.status(200).json({ 
      success: true,
      message: `Cleaned up ${deletedCount} expired tokens` 
    });
    
  } catch (error) {
    console.error('❌ Error cleaning up expired tokens:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to cleanup expired tokens',
      error: error.message 
    });
  }
};



module.exports.getUserArchivedRecords =async(req, res)=>{

  try {
    const userId = req.user.uuid; 
    console.log(userId)
    
    const result = await ArchiveService.getAllUserArchivedRecords(userId);
    
    res.status(200).json({
      success: true,
      message: 'Your archived records retrieved successfully',
      ...result
    });

  } catch (error) {
    console.error('Error fetching user archived records:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch archived records',
      error: error.message
    });
  }



}

module.exports.restoreRecords = async(req, res)=>{
  try{
    const recordId = req.params.uuid
    const userId = req.user.uuid;
    console.log(recordId)
    const result = await ArchiveService.restoreRecordById(recordId, userId)

    res.status(200).json({
      success: true,
      message: 'Your archived record restored successfully',
      ...result
    });

  }catch(error){
    console.error('Error restoring record:', error);
    res.status(500).json({
      success: false,
      message: 'Error restoring record',
      error: error.message
    });

  }
}