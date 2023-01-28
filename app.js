//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const { maxBy } = require('lodash');
const session=require('express-session');
const passport=require('passport');
const passportLocalMongoose=require('passport-local-mongoose');


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

app.use(session({
    secret:"Thisisourlittlesecret.",
    resave:false,
    saveUninitialized:false
}))

app.use(passport.initialize());
app.use(passport.session());


mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/userDB');


const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);



const User = new mongoose.model("User", userSchema);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/register", function (req, res) {
    res.render("register");
});

app.get("/secrets",function(req,res){
    if(req.isAuthenticated()){
        res.render("secrets");
    }
    else{
        res.redirect("/login");
    }
});

app.get("/logout",function(req,res){
    req.logout(function(){});
    res.redirect("/");
});

app.post("/register", function (req, res) {

    // bcrypt.hash(req.body.password, saltRounds, function (err, hash) {

    //     const newUser = new User({
    //         email: req.body.username,
    //         password: hash
    //     });
    //     newUser.save(function (err) {
    //         if (err) res.send("Error registereing");
    //         else res.render("secrets");
    //     });
    // });
    User.register({username:req.body.username},req.body.password,function(err,user){
        if(err){
            console.log(err);
            res.redirect("/register");
        }
        else {
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets");
            });
        }
    });

});

app.post("/login", function (req, res) {
    // User.findOne({ email: req.body.username }, function (err, result) {
    //     if (!err) {
    //         if (result) {
    //             bcrypt.compare(req.body.password, result.password, function (err, match) {

    //                 if (match==true) { res.render("secrets"); }
    //                 else res.send("Password Mismatched!! ");

    //             });
    //         }
    //         else res.send("User not found");
    //     }

    //     else res.send(err);
    // });
    const user=new User({
        username:req.body.username,
        password:req.body.password
    });

    req.login(user,function(err){
        if(err){
            console.log(err);

        }else {
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets");
            });
        }
    });
});













app.listen(3000, function () {
    console.log("Server started on port 3000.");
});