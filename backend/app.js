const express = require("express")
const dotenv = require("dotenv")
dotenv.config()

const app = express()

app.get("/", (req, res) => {
    return res.send("Greetings! Welcome to Job Tracker API.")
})

app.listen(process.env.PORT, () => {
    console.log(`job tracker api is running on port ${process.env.PORT}`)
})