const express = require("express")
const router = express.Router()
const { isLoggedIn } = require("../auth")
var User     = require("../models/userSchema")

router.get("/", isLoggedIn, (req,res)=> {
    User.findOne({username: req.user.username}, (err, found) => {
        if(err){
            console.log(err)
        } else {
            res.render("profile", {user: found})
        }
    })
})

router.get("/delete", isLoggedIn, (req,res)=>{
    User.findOneAndDelete({username:req.user.username}, (err, deleted)=>{
        if(err){
            console.log(err)
        } else{
            console.log("Deleted Profile Successfully")
            res.redirect('/')
        }
    })
})

module.exports = router