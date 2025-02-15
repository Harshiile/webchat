import express from "express";
require('dotenv').config();

const app = express()

const PORT = process.env.PORT || 5000
app.get('/', (req, res) => {
    res.json("hello")
})
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
