const express = require("express")
const router = express.Router()
var bodyParser = require('body-parser')
const { isLoggedIn } = require("../auth")
var User     = require("../models/userSchema")
router.use(bodyParser.json())

router.get("/", isLoggedIn, (req,res)=> {
    User.findOne({username: req.user.username}, (err, found)=>{
        if(err){
            console.log(err)
        } else {
            res.render("voiceNotes", {notesArray: found.voiceNotes})
        }
    })
})

router.post("/", (req,res) => {
    var filter = {username: req.user.username}
    var update = {$push : {voiceNotes: [{"voiceNoteLink": req.body[0].voiceNoteLink, "voiceNoteName":req.body[0].voiceNoteName}]}}
    User.findOneAndUpdate(filter, update, {upsert:true}, function(err,update){
        if(err){
            console.log(err)
        } else{
            console.log("updated Successfully")
        }
    })
})

module.exports = router