import bcrypt from 'bcryptjs'

function register(username,password) {
    //Encrypt password
    const hashedPassword = bcrypt.hashSync(password,8)
    console.log(username,hashedPassword) //check before using database

    //Handle database
}
function login(username,password) {
    const hashedPassword = bcrypt.hashSync(password,8)
    console.log(username,hashedPassword)
    //Handle database
}

export default { register,login}