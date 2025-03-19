const { User, Notification, RefreshToken } = require('../models');
const { sendAccountCreationEmail, sendPasswordResetEmail, sendResetSuccessEmail } = require('../mails/email');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const LocalStrategy = require('passport-local').Strategy;
const dotenv = require('dotenv');
const { Op } = require('sequelize');

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
    { expiresIn: '1h' }
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

// Sign Up
module.exports.signUp = async (req, res) => {
  const userId = req.userId;
  console.log(userId)
  const { firstName, lastName, email, gender, phoneNumber, idNumber, dateJoined, password, role, confirmPassword } = req.body;

  try {
    let isApproved = false;
    let isDefaultPassword = false;
    let hashedPassword;

    if (userId) {
      const admin = await User.findOne({ where: { uuid: userId } });

      if (!admin) {
        return res.status(404).json({ message: 'Admin user not found' });
      }

      if (admin.role === 'Admin') {
        console.log("Creating account")
        isApproved = true;
        isDefaultPassword = true;
        const defaultPassword = 'DVRLAB@2025';
        hashedPassword = await bcrypt.hash(defaultPassword, 10);
      } else {
        return res.status(403).json({ message: 'Only Admins can create new users' });
      }
    } else {
      if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
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
      await sendAccountCreationEmail(newUser.email, 'DVRLAB@2025');
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
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    if (!user.isApproved) {
      return res.status(403).json({ approvalRequired: true });
    }

    const accessToken = generateToken(user);
    const refreshToken = await generateRefreshToken(user);

    if (user.isDefaultPassword) {
      return res.status(403).json({
        message: 'You must change your password before proceeding',
        changePasswordRequired: true,
        accessToken,
      });
    }

    res.status(200).json({ user, accessToken, refreshToken, message: 'Login successful' });
  })(req, res, next);
};

// Refresh Token
module.exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    const storedToken = await RefreshToken.findOne({ where: { token: refreshToken } });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      return res.status(401).json({ message: 'Refresh token is invalid or expired' });
    }

    const user = await User.findByPk(storedToken.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const newAccessToken = generateToken(user);
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Forgot Password
module.exports.forgotPass = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'Email not found.' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = Date.now() + 3600000; // 1 hour
    await user.save();

    await sendPasswordResetEmail(email, `${process.env.CLIENT_URL}/resetPassword/${resetToken}`);

    res.status(200).json({ message: 'Reset email sent!' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
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
module.exports.profile = async (req, res, next) => {
  passport.authenticate('jwt', { session: false }, async (err, user, info) => {
    if (err) {
      console.error('Authentication error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    
    if (!user) {
      return res.status(401).json({ 
        message: 'Unauthorized',
        details: info?.message || 'Invalid or expired token'
      });
    }

    try {
      // Fetch fresh user data from database
      const userData = await User.findOne({ 
        where: { uuid: user.uuid },
        attributes: [
          'uuid',
          'firstName',
          'lastName',
          'email',
          'role',
          'isActive',
          'createdAt',
          'updatedAt'
        ],
        raw: true
      });

      if (!userData) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json(userData);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ message: 'Error fetching user profile' });
    }
  })(req, res, next);
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