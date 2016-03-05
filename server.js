//server.js

var express = require("express");
var app = express();
var port = process.env.PORT || 3000;


app.get("/", function(req, res) {
    res.send("ootd redesign");
});




app.listen(port, function() {
    console.log("server running on PORT:", port);
});