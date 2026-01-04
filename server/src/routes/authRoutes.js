import express from 'express'
import authControllers from '../controllers/authControllers.js'
const router = express.Router()


//Register for manager (Only manger must be register)
//Employee account just be create by manager

router.post('/register',authControllers.controllersRegister);
router.post('/login',authControllers.controllersLogin);
router.post('/forgot-password',authControllers.controllersForgotPassword);
router.post('/reset-password',authControllers.controllersResetPassword);
router.post('/verify-otp', authControllers.controllersVerifyOtp);


export default router