// ================================
// server.js =====================
// ================================
var express     = require("express");
var env         = process.env.NODE_ENV = process.env.NODE_ENV || "development";
var app         = express();
var port        = process.env.PORT || 3000;
var dotenv      = require("dotenv");
var bodyParser  = require("body-parser");
var morgan      = require("morgan");
var request     = require("request");
var mongoose    = require("mongoose");
var _           = require("lodash");
var jwt         = require("jsonwebtoken");
var Tag         = require("./server/models/tag.js");
var User        = require("./server/models/user.js");

// ================================
// load .env file =====================
// ================================
dotenv.config();

// ================================
// super secret for token =====================
// ================================
//var superSecret = process.env.Super_Secret;

// ================================
// connect to mongo db =====================
// ================================
mongoose.connect(
    process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    "mongodb://localhost/ootd_2016");

// ================================
// middleware =====================
// ================================
app.set("superSecret", process.env.Super_Secret);

// use body parser for to get info from post ========
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// use morgan to log request to console =========
app.use(morgan("dev"));
// allow Cross Origin Request
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});
// setup static files root dir ================
app.use(express.static("public"));


// ================================
// routes =========================
// ================================
var apiRoutes = express.Router();



function ensureAuthorization(req, res, next) {

    var token = req.body.token || req.query.token || req.headers["x-access-token"];

    // decode token
    if (token) {
        // verify secret and checks expiration
        jwt.verify(token, app.get("superSecret"), function (err, decoded) {
            if (err) {
                return res.json({
                    success: false,
                    message: "Failed to authenticate token."
                });
            } else {
                // save decoded to req
                req.decoded = decoded;
                next();
            }
        });
    } else {
        // if no token return error
        return res.status(403).send({
            success: false,
            message: "No token provided."
        });
    }
};

// authenticate ================

apiRoutes.post("/signup", function(req, res) {
   var user = new User({
       username: req.body.username,
       password: req.body.password
   });

    user.save(function(err, savedUser) {
            if (err) {throw err;}
            // create token
            var token = jwt.sign(user, app.get("superSecret"), {
                expiresIn: 86400 // 24hrs in seconds
            });

            return res.json({
                success: true,
                message: "Token sent.",
                token: token,
                user: savedUser
            });
        });


});

apiRoutes.post("/login", function(req, res) {

    User.findOne({username: req.body.username})
        .exec(function(err, user) {
            console.log("user:", user);
            if (err) {throw err;}

            if (!user) {
                res.json({
                    success: false,
                    message: "Authentication failed. User not found."
                });
            } else if (user) {
                // check if password matches  =========
                //if (user.password !== req.body.password) {
                if (!user.comparePassword(req.body.password)) {
                    return res.json({
                        success: false,
                        message: "Authentication failed. Wrong password."
                    });
                } else {
                    // if user is found and password is correct
                    var token = jwt.sign(user, app.get("superSecret"), {
                        expiresIn: 86400 // 24hrs in seconds
                    });

                    // return the information including token as json
                    return res.json({
                        success: true,
                        message: "Token sent.",
                        token: token,
                        user: user
                    });

                }
            }
        });
});

// Discover ========================
apiRoutes.get("/discover", function(req, res) {

    res.send("ha ha discovery");
});

//apiRoutes.post("/sign-up", function(req, res) {
//    var user = new User({
//
//    });
//    res.json({message:"still working on this"});
//});

apiRoutes.get("/setup", function(req, res) {
    // create test user
    var gb = new User({
        username: "bobo",
        password: "password",
        admin: true
    });

    gb.save(function(err) {
        if (err) {throw err;}

        console.log("User saved successfully");
        res.json({success: true});
    });

});


// middleware to verify token
//apiRoutes.use(function(req, res, next) {
//
//    var token = req.body.token || req.query.token || req.headers["x-access-token"];
//
//    // decode token
//    if (token) {
//        // verify secret and checks expiration
//        jwt.verify(token, app.get("superSecret"), function(err,decoded) {
//            if (err) {
//                return res.json({
//                    success: false,
//                    message: "Failed to authenticate token."
//                });
//            } else {
//                // save decoded to req
//                req.decoded = decoded;
//                next();
//            }
//        });
//    } else {
//        // if no token return error
//        return res.status(403).send({
//            success: false,
//            message: "No token provided."
//        });
//    }
//});



// Users ========================


apiRoutes.get("/users", ensureAuthorization, function(req, res) {

    User.find({})
        .exec(function(err, users) {
            console.log("found users",users);
            res.json(users);
        });
});

app.get("/api/v1/users/:id", function(req, res) {


});

// Outfits ========================
app.get("/api/v1/users/:id/outfits", function(req, res) {


});

// Tags ========================
app.get("/api/v1/tags", function(req, res) {

});

app.get("/api/v1/tags/:id", function(req, res) {

});


//check if mongoose is hooked up correctly
//var tagOne;
//
//Tag.findOne({}).exec(function(err, foundTag) {
//    tagOne = foundTag;
//    console.log("the first tag",tagOne);
//});

app.use("/api/v1", apiRoutes);

// root route
apiRoutes.get("/", function(req, res) {
    res.sendFile(__dirname + "/public/index.html");
});
app.listen(port, function() {
    console.log("server running on PORT:", port);
});