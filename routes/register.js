const express = require("express")
const router = express.Router()

var passportLocalMongoose = require('passport-local-mongoose'),
    LocalStrategy         = require("passport-local"),
    bodyParser            = require('body-parser'),
    passport              = require('passport'),
    mongoose              = require("mongoose")

var User     = require("../models/userSchema")

router.get("/", (req,res)=>{
    res.render("register")
})

router.post("/", (req,res)=>{
    User.register(new User({
        username: req.body.username
    }),
    req.body.password, (err, user)=>{
        if(err){
            console.log(err)
        } else{
            console.log("Registered Succesfully")
            res.redirect("/")
        }
    })
})

module.exports = router