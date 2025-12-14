import express from 'express'
const app = express()
const PORT = process.env.PORT || 8888


app.listen(PORT , ()=> console.log(`server has started on PORT: ${PORT} `))