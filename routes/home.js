const express = require("express")
const router = express.Router()
const { isLoggedIn } = require("../auth")

router.get("/", isLoggedIn, (req,res)=>{
    res.render("home", {user: req.user})
})

module.exports = router