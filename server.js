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
var moment      = require("moment");
var _           = require("lodash");
var jwt         = require("jwt-simple");
var Tag         = require("./server/models/tag.js");
var User        = require("./server/models/user.js");
var Outfit     = require("./server/models/outfit.js");

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
app.set("tokenSecret", process.env.TOKEN_SECRET);

// use body parser for to get info from post ========
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// use morgan to log request to console =========
app.use(morgan("dev"));
// pieces Cross Origin Request
app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type, Authorization");
    next();
});
// setup static files root dir ================
app.use(express.static("public"));


// ================================
// routes =========================
// ================================
var apiRoutes = express.Router();

// ==============================
// create jwt token and return it
// ==============================
function createJwt(user) {
    var payload = {
        sub: user._id,
        iat: moment().unix(),
        exp: moment().add(24, "hours").unix()
    };

    return jwt.encode(payload, app.get("tokenSecret"));
}

// middleware that checks if request has token in header ======
function ensureAuthorization(req, res, next) {

    // var token = req.body.token || req.query.token || req.headers["x-access-token"];
    if (!req.header("Authorization")) {
        return res.status(401).send({message: "Please make sure you have a request has Authorization header"});
    }

    var token = req.header("Authorization").split(" ")[1];
    var payload;

    payload = jwt.decode(token, app.get("tokenSecret"));


    if (payload.exp <= moment().unix()) {
        return res.status(401).send({message: "Token has expired."});
    }

    req.user = payload.sub;
    next();
}

// authenticate ================
apiRoutes.post("/signup", function(req, res) {
    User.findOne({email: req.body.email})
        .exec(function (err, existingUser) {
            if (existingUser)  {
                // 409 Conflict Error
                return res.status(409).send({message: "Email or Password is taken."});
            }
            var user = new User({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            });

            user.save({username:1},function (err, savedUser) {
                if (err) {
                    // 500 Internal Server Error
                    console.log(err.message);
                    return res.status(500).send({message:"Email or Password is taken."});
                }

                res.send({
                    token: createJwt(savedUser),
                    user:savedUser.cleanUserResponse()
                });
            });

        });
});

apiRoutes.post("/login", function(req, res) {

    User.findOne({email: req.body.email})
        .select("+password")
        .exec(function(err, user) {
            console.log("user:", user);
            if (!user) {
                // 404 Not Found
                return res.status(404).send({message: "Invalid Email or Password."});
            }
            user.comparePassword(req.body.password, function(err, isMatch) {
                if (!isMatch) {
                    console.log("ismath", isMatch);
                    return res.status(401).send({message: "Invalid Email or Password."});
                }
                res.send({
                    token: createJwt(user),
                    user: user.cleanUserResponse()
                });
            });
        });
});


// currentuser =====================
apiRoutes.get("/me", ensureAuthorization, function (req, res) {
    User.findById(req.user)
       .exec(function(err, foundUser) {
           if (err) {throw err;}
           console.log("foundUser", foundUser);
           res.status(200).send(foundUser);
       });
});

apiRoutes.get("/trending", ensureAuthorization, function (req, res) {
    console.log("the user is req.user", req.user);
    res.json({trends:["some","trendys"]});
});
// Discover ========================
apiRoutes.get("/discover", function(req, res) {
    console.log("discover was hit");
    request.get("https://api.instagram.com/v1/tags/ootd/media/recent?client_id=" + process.env.clientId, function(err,respond, body) {
        // console.log("the discover body", body);
        var pictures = JSON.parse(body);
        //console.log("pictures", pictures.data)
        if (err) {
            console.log("Error retrieving pictures.", err);
            return res.status(500).send({message:"Error retrieving pictures."});
        }
        res.send(pictures.data);

    });
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


// Users ========================
apiRoutes.get("/users", ensureAuthorization, function(req, res) {
    User.find({})
        .exec(function(err, users) {
            console.log("found users",users);
            res.json(users);
        });
});
// Outfits ========================

apiRoutes.get("/users/outfits", ensureAuthorization, function(req, res) {
    User.findById(req.user)
        .populate("outfits")
        .exec(function(err, foundUser) {
            // console.log(err.message);
            if (err) {
                console.log("Error Message:", err.message);
                return res.status(500).send({message:"Error finding user."});
            }
            console.log("foundUser", foundUser.username);

            res.status(200).send(foundUser);


            //send save outfit send type in query params,
            // check if there or send nothing
            // save outfit to db
            // push the savedOutfit to user.
            // return confirmation.


        });

});

apiRoutes.post("/users/outfits", ensureAuthorization, function(req, res) {
    // /api/v1/users/:id/outfits?pieces=1&tops=2
	console.log("req.body post", req.body);
    var outfit =  new Outfit({
        imgUrl: req.body.imgUrl,
        author: req.body.author,
        type:  req.body.type
    });

		outfit.save(function(err,savedOutfit) {
			if (err) {
				console.log("Error saving outfit to db:", err);
				res.status(500).send({message: "Error saving outfit."})
			}
			console.log("Successful outfit saved", savedOutfit);
			User.findById(req.user)
				.exec(function (err, user) {
					if (err) {
						console.log("Error Message:", err.message);
						return res.status(500).send({message:"Error finding user."});
					}
					user.outfits.unshift(savedOutfit._id);

					user.save(function (err, savedUser) {
						if (err) {
							console.log("Error Message:", err.message);
							return res.status(500).send({message:"Error saving user."});
						}
						console.log("Successful outfit update");
						res.status(201).send(savedOutfit);
					});
				});

		});
});
apiRoutes.delete("/users/outfits/:outfitId", ensureAuthorization, function(req, res) {
	// /api/v1/users/:id/outfits?pieces=1&tops=2
	// console.log("req.body delete", req.params	);
	var outfitId =  req.params.outfitId;
	User.findById(req.user)
		.exec(function (err, foundUser) {
			if (err) {
				console.log("Error Message:", err.message);
				return res.status(500).send({message:"Error finding user."});
			}
			var index = foundUser.outfits.indexOf(outfitId);

			if (index >= 0) {
				foundUser.outfits.splice(index,1);
			} else {
				console.log("Outfit was not in outfits to delete");
				return res.status(500).send({message:"Error outfit not in user outfits."});
			}

			foundUser.save(function (err, savedUser) {
					if (err) {
						console.log("Error Message:", err.message);
						return res.status(500).send({message:"Error saving user."});
					}
					Outfit.findByIdAndRemove(outfitId)
						.exec(function (err, foundOutfit) {
							if (err) {
								console.log("Error Message:", err.message);
								return res.status(500).send({message:"Error finding outfit."});
							}
							console.log("Successful delete of outfit:", foundOutfit);

							// res.status(200).send(savedUser);
							User.findById(savedUser._id)
								.populate("outfits")
								.exec(function (err, foundUser)  {
									if (err) {
										console.log("Error Message:", err.message);
										return res.status(500).send({message:"Error finding user."});
									}
									res.status(200).send(savedUser);

								});
						});
				});
		});

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