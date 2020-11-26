const express = require("express")
const router = express.Router()

var User     = require("../models/userSchema")

var passportLocalMongoose = require('passport-local-mongoose'),
    LocalStrategy         = require("passport-local"),
    bodyParser            = require('body-parser'),
    passport              = require('passport'),
    mongoose              = require("mongoose")

router.get("/", (req,res)=>{
    res.render("login")
})

router.post('/',
passport.authenticate('local', { successRedirect: '/',
                                 failureRedirect: '/' }));

router.get('/login_fail', (req,res)=>{
    res.send("Login Failed!")
})

router.get('/logging_in', (req,res)=>{
    console.log("Login Success!")
    res.redirect('home')
})

module.exports = router