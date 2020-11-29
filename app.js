require('dotenv').config()
var passportLocalMongoose = require('passport-local-mongoose'),
    LocalStrategy         = require("passport-local"),
    bodyParser            = require('body-parser'),
    passport              = require('passport'),
    mongoose              = require("mongoose"),
    moment                = require('moment')
    today                 = moment()
    fs                    = require('fs')

    var express = require('express');
    var app = express();
    var router = express.Router()

//-----------------MONGODB-----------------------
mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost/SERVER');
var User     = require("./models/userSchema")
//-------------------------------------------------

//------------------------------------------------
app.use(express.static("public"))
app.set('view engine', 'ejs')
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))
//-------------------------------------------------

//--------------Passport(auth)-------------------------------------------
app.use(require('express-session')({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
//-----------------------------------------------------------------


//==============================================================
//---------------------RESTful Routes---------------------------
//==============================================================



//---------------Define Routes--------------
const loginRoutes = require("./routes/login")
const registerRoutes = require("./routes/register")
const homeRoute = require("./routes/home")
const profileRoute = require("./routes/profile")
//------------------------------------------


//---------------Use Routes-----------------
app.use("/", homeRoute)
app.use("/login", loginRoutes)
app.use("/register", registerRoutes)
app.use("/profile", profileRoute)

//------------------------------------------

const port = process.env.PORT || 8000;
app.listen(port), () => {
 console.log("Server running on localhost")
}