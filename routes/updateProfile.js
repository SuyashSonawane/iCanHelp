const express = require("express")
const router = express.Router()
const { isLoggedIn } = require("../auth")
var User     = require("../models/userSchema")
var bodyParser = require('body-parser')
router.use(bodyParser.json())


var passportLocalMongoose = require('passport-local-mongoose'),
    LocalStrategy         = require("passport-local"),
    bodyParser            = require('body-parser'),
    passport              = require('passport'),
    mongoose              = require("mongoose")

var User     = require("../models/userSchema")
const { update } = require("../models/userSchema")

router.get("/", isLoggedIn, (req,res)=>{
    User.findOne({username: req.user.username}, (err, found)=>{
        res.render("updateProfile", {user:found})
    })
})

router.post("/", isLoggedIn, (req,res)=>{
    filter = {username: req.user.username}
    update = {
        name: req.body.name,
        age: req.body.age,
        address: req.body.address,
        gender:req.body.gender,
        emergencyNo: req.body.emergencyNo,
        contactNo: req.body.contactNo,
        doctor: req.body.doctor,
        medicalHistory: req.body.medicalHistory,
        bloodGroup: req.body.bloodGroup
    }
    User.findOneAndUpdate(filter, update, {upsert:true}, function(err,update){
        if(err){
            console.log(err)
        } else{
            console.log("updated Successfully")
            res.redirect("/profile")
        }
    })
})

router.post("/photo", isLoggedIn, (req,res)=>{
    const filter = {username: req.user.username}
    const update = {profilePhoto: req.body.profilePhoto}
    console.log("UPDATE : " +update)
    User.findOneAndUpdate(filter, update, {upsert:true}, (err, update)=>{
        if(err){console.log(err)}
        else{
            console.log("updated Successfully")
        }
    })
})

module.exports = router