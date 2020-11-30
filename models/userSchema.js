var mongoose = require('mongoose')
var passportLocalMongoose = require('passport-local-mongoose')

//Model Config
var userSchema = new mongoose.Schema({
    username: {
        type:String,
        unique:true
    },
    password: String,
    name: String, 
    age : String,
    address: String,
    gender: String,
    profilePhoto: String,
    emergencyNo: String,
    contactNo: String,
    bloodGroup: String,
    doctor: String,
    voiceNotes: Array,
    medicalHistory: Array,
    locationHistoy: Array,
    firstLogin: String,
    created: {type: Date, default: Date.now}
})

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", userSchema)