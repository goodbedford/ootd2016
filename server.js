//server.js

var express = require("express");
var app = express();
var port = process.env.PORT || 3000;


app.use(express.static("public"));
app.use(express.static("views"));


app.get("/", function(req, res) {
    res.send("#ootd redesign");
});



app.listen(port, function() {
    console.log("server running on PORT:", port);
});