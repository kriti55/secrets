//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { maxBy } = require('lodash');
const saltRounds = 10;


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');



mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/userDB');


const userSchema = new mongoose.Schema({
    email: String,
    password: String
});




const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/register", function (req, res) {
    res.render("register");
});



app.post("/register", function (req, res) {

    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {

        const newUser = new User({
            email: req.body.username,
            password: hash
        });
        newUser.save(function (err) {
            if (err) res.send("Error registereing");
            else res.render("secrets");
        });
    });
});

app.post("/login", function (req, res) {
    User.findOne({ email: req.body.username }, function (err, result) {
        if (!err) {
            if (result) {
                bcrypt.compare(req.body.password, result.password, function (err, match) {

                    if (match==true) { res.render("secrets"); }
                    else res.send("Password Mismatched!!");

                });
            }
            else res.send("User not found");
        }

        else res.send(err);
    });
});













app.listen(3000, function () {
    console.log("Server started on port 3000.");
});