//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs=require("ejs");
const encrypt = require("mongoose-encryption");
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');



mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/userDB');


const userSchema=new mongoose.Schema({
      email:String,
      password:String 
});


userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

const User=new mongoose.model("User",userSchema);

app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});



app.post("/register",function(req,res){
    const newUser=new User({
        email:req.body.username,
        password:req.body.password
    })
    newUser.save(function(err){
        if(err) res.send("Error registereing");
        else res.render("secrets");
    });
})

app.post("/login",function(req,res){
    User.findOne({email:req.body.username},function(err,result){
        if(!err){
            if(result) {
                if(result.password===req.body.password){res.render("secrets");}
            else res.send("User not found");

        }
        else res.send(err);}
    })
})












app.listen(3000, function () {
    console.log("Server started on port 3000.");
});