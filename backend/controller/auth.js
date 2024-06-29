const express = require("express")
const User = require("../model/user")
const { sendResponse } = require("../helper")

const authRouter = express.Router()

authRouter.post("/register", (req, res, next) => {
    const newUser = User(req.body)

    return User.create(newUser)
    .then(data => {
        return sendResponse(res, data)
    })
    .catch(error => next(error))
})

module.exports = authRouter