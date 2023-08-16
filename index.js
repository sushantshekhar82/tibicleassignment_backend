const express=require('express')
const mongoose=require("mongoose")
const cors = require('cors')
const router = require('./routes/user')
const prodrouter = require('./routes/products')
require('dotenv').config()
const app=express()
app.use(express.json())

app.get("/",(req,res)=>{
    res.status(200).send("welcome")
})
app.use("/api/user",router)
app.use("/api/prod",prodrouter)

app.listen(process.env.port,async()=>{
    try {
       mongoose.connect(process.env.mongourl) 
    console.log("server running at port")
    } catch (error) {
       console.log(error) 
    }
})