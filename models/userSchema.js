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
    rollNo: String,
    year: String,
    dept: String,
    div: String,
    bloodGroup: String,
    voiceNotes: Array,
    firstLogin: String,
    created: {type: Date, default: Date.now}
})

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", userSchema)