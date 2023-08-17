const express=require('express')
const mongoose=require("mongoose")
const cors = require('cors')
const router = require('./routes/user')
const prodrouter = require('./routes/products')
const depositRoutes = require('./routes/deposit');
const buyRoutes = require('./routes/buy')
const resetRoutes = require('./routes/reset')
const purchaserouter = require('./routes/purchasehistory')
require('dotenv').config()
const app=express()
app.use(express.json())
app.use(cors({ origin: ['https://myntracloneproject.vercel.app','https://myntrawebproject.netlify.app','http://localhost:3000'], optionsSuccessStatus: 200 }));

app.options("*", cors({ origin: ['https://myntracloneproject.vercel.app','https://myntrawebproject.netlify.app','http://localhost:3000'], optionsSuccessStatus: 200 }));

app.get("/",(req,res)=>{
    res.status(200).send("welcome")
})
app.use("/api/user",router)
app.use("/api/prod",prodrouter)
app.use('/api/vending-machine', depositRoutes);
app.use('/api/vending-machine',buyRoutes);
app.use('/api',resetRoutes);
app.use('/api/vending-machine', purchaserouter);
app.listen(process.env.port,async()=>{
    try {
       mongoose.connect(process.env.mongourl) 
    console.log("server running at port")
    } catch (error) {
       console.log(error) 
    }
})