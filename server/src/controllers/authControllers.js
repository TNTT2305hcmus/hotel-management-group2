import authServices from '../services/authServices.js';

async function controllersRegister(req, res) {
  try {
    const { username, password, accountTypeID } = req.body;

    await authServices.register(username, password, accountTypeID);

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({ error: err.message });
  }
}

// Use token returned from service
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

    // Log OTP to console for mock flow
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

export default { controllersRegister, controllersLogin, controllersForgotPassword, controllersResetPassword };
