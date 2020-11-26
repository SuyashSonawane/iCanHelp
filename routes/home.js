const express = require("express")
const router = express.Router()
const { isLoggedIn } = require("../auth")

router.get("/", isLoggedIn, (req,res)=>{
    res.send("Welcome, You're logged in!")
})

module.exports = router