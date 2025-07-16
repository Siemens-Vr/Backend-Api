const {Router } =  require('express')

const userRouter = Router();
const {verifyToken} = require('../middleware/verifyToken')
const {authenticateJwt} =require('../middleware/auth')


const { login, signUp , profile ,logout, refreshToken,approveUser, forgotPass,getPendingUsers,restoreRecords, getUserArchivedRecords, resetPassword} = require('../controllers/users')

// const isAuthenticated = require('../middleware/isAuthenticated');

 
// userRouter.get('/', getUsers)
userRouter.post('/signup',verifyToken, signUp)
userRouter.post('/login', login)
userRouter.get('/unApproved', getPendingUsers)
userRouter.get('/:id/approved', approveUser)
userRouter.post('/refresh-token',  refreshToken); 
userRouter.get('/profile', authenticateJwt,  profile)
userRouter.post('/forgotPassword',  forgotPass)
userRouter.get('/archived',authenticateJwt,getUserArchivedRecords )
userRouter.get('/restore/:uuid',authenticateJwt,restoreRecords )


userRouter.post('/logout', logout)

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