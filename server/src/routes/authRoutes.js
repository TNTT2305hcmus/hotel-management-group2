import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
const router = express.Router()


//Register for manager (Only manger must be register)
//Employee account just be create by manager
router.post('/register', (req,res) => { 
    const {username,password} = req.body
    //Encrypt password
    const hashedPassword = bcrypt.hashSync(password,8)
    console.log(username,hashedPassword) //check before using database
    res.sendStatus(200)//check before using database
    
    
    //Handle database
  }
)




//Use token to differentiate roles
router.post('/login',(req,res) =>{
  
  const {username,password,role} = req.body
  console.log(username,password,role) //check before using database
  try {

    //check database

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


  


})



export default router