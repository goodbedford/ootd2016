//server.js
var express = require("express");
var env = process.env.NODE_ENV = process.env.NODE_ENV || "development";
var app = express();
var port = process.env.PORT || 3000;
var dotenv = require("dotenv");
var bodyParser = require("body-parser");
var request = require("request");
var mongoose = require("mongoose");
var _ = require("lodash");
var Tag = require("./server/models/tag.js");

// load .env file
dotenv.config();


// middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static("public"));

// connect to db
mongoose.connect(
    process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    "mongodb://localhost/ootd_2016");

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/public/index.html");
});

// Discover
app.get("/api/v1/discover", function(req, res) {

});

// Users
app.get("/api/v1/users/:id", function(req, res) {


});

// Outfits
app.get("/api/v1/users/:id/outfits", function(req, res) {


});

// Tags
app.get("/api/v1/tags", function(req, res) {

});

app.get("/api/v1/tags/:id", function(req, res) {

});


//check if mongoose is hooked up correctly
var tagOne;

Tag.findOne({}).exec(function(err, foundTag) {
    tagOne = foundTag;
    console.log("the first tag",tagOne);
});

app.listen(port, function() {
    console.log("server running on PORT:", port);
});