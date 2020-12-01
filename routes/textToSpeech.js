const express = require("express")
const router = express.Router()
const { isLoggedIn } = require("../auth")
var User = require("../models/userSchema")

router.get("/", isLoggedIn, (req, res) => {
    res.render("textToSpeech")
})

module.exports = router