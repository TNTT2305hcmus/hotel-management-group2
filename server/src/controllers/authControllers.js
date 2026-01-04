import authServices from '../services/authServices.js';

async function controllersRegister(req, res) {
  try {
    const { username, password, email, phone, accountTypeID } = req.body;

    // Call service
    await authServices.register(username, password, email, phone, accountTypeID);

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({ error: err.message });
  }
}

async function controllersLogin(req, res) {
  try {
    const { username, password } = req.body;

    const data = await authServices.login(username, password);

    return res.status(200).json(data);
  } catch (err) {
    console.log(err.message);
    return res.status(401).json({ error: err.message });
  }
}

async function controllersForgotPassword(req, res) {
  try {
    const { email } = req.body;

    const data = await authServices.forgotPassword(email);

    if (data?.mockOtp) {
      console.log(`[ForgotPassword] email: ${email}, otp: ${data.mockOtp}`);
    }

    return res.status(200).json(data);
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({ error: err.message });
  }
}

async function controllersResetPassword(req, res) {
  try {
    const { email, otp, newPassword } = req.body;

    const data = await authServices.resetPasswordWithOtp(email, otp, newPassword);

    return res.status(200).json(data);
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({ error: err.message });
  }
}

async function controllersVerifyOtp(req, res) {
  try {
    const { email, otp } = req.body;
    // Gọi service check
    const data = await authServices.verifyOtp(email, otp);
    return res.status(200).json(data);
  } catch (err) {
    // console.log(err.message);
    return res.status(400).json({ error: err.message });
  }
}


export default { 
    controllersRegister, 
    controllersLogin, 
    controllersForgotPassword, 
    controllersResetPassword,
    controllersVerifyOtp
};