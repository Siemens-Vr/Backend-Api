const {Router } =  require('express')

const userRouter = Router();
const {verifyToken} = require('../middleware/verifyAdminSignUp')
const {isAdmin} = require('../middleware/isAdmin')

const { login, signUp , profile, getUsers, refreshToken,approveUser, forgotPass,getPendingUsers, resetPassword} = require('../controllers/users')

// const isAuthenticated = require('../middleware/isAuthenticated');
 
  

 
// userRouter.get('/', getUsers)
userRouter.post('/signup',verifyToken, signUp)
userRouter.post('/login', login)
userRouter.get('/unApproved', getPendingUsers)
userRouter.get('/:id/approved', approveUser)
userRouter.post('/refresh-token', verifyToken, refreshToken); 
// userRouter.get('/profile',  verifyToken, profile)
userRouter.post('/forgotPassword',  forgotPass)

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset User Password
 *     description: This API handles both Forgot Password and First-Time Login Password Reset.
 *     parameters:
 *       - in: body
 *         name: PasswordReset
 *         schema:
 *           type: object
 *           required:
 *             - newPassword
 *           properties:
 *             token:
 *               type: string
 *               description: Reset token (only for forgot password)
 *             newPassword:
 *               type: string
 *               description: New user password
 *     responses:
 *       200:
 *         description: Password Reset Successful
 *       400:
 *         description: Invalid Token or Request
 */
userRouter.post('/resetPassword/:resetPasswordToken',  resetPassword)

module.exports = userRouter