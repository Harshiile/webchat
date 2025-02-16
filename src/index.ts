import express from "express";
import router from "./routes/post";
import { connectDB } from "./lib/connect";
require('dotenv').config();
import cors from 'cors'
import CookieParser from 'cookie-parser'

const app = express()
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(CookieParser())
app.use('/api/v0', router)

const PORT = process.env.PORT || 5000

connectDB()
    .then(res => {
        app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
    })
