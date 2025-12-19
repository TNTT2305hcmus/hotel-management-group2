import jwt from 'jsonwebtoken'
import authServices from '../services/authServices.js'

function controllersRegister(req,res) {
  try {
    const {username,password} = req.body
    authServices.register(username,password)
    res.sendStatus(200)
  }
  catch (err)
  {
    console.log(err.message)
    res.sendStatus(400)
  }

}


//Use token to differentiate roles
function controllersLogin(req,res) {

  try {
    const {username,password,role} = req.body
    authServices.login(username,password,role)
    //successful authentication
    if (role === 'manager') {

      const token = jwt.sign({
      //id: user.id,
      role: "manager"
      },process.env.JWT_SECRET,{expiresIn: '8h'})
      res.json({token})
    } 
    else {
      const token = jwt.sign({
      //id: user.id,
      role: "employee"
      },process.env.JWT_SECRET,{expiresIn: '8h'})
      res.json({token})
    }
    

  } catch(err) {
    console.log(err.message)
    res.sendStatus(503)
  }

}


export default { controllersRegister,controllersLogin }