// ================================
// server.js =====================
// ================================
var express 	= require("express");
var path 			= require("path");
var env 			= process.env.NODE_ENV = process.env.NODE_ENV || "development";
var app 			= express();
var port 			= process.env.PORT || 3000;
var dotenv 		= require("dotenv");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var request = require("request");
var mongoose = require("mongoose");
var moment = require("moment");
var _ = require("lodash");
var jwt = require("jwt-simple");
var Tag = require("./server/models/tag.js");
var User = require("./server/models/user.js");
var Outfit = require("./server/models/outfit.js");
var outfitHelper = require("./server/helpers/outfitHelper.js");
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
app.use(function (req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST");
	res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type, Authorization");
	next();
});
// setup static files root dir ================
app.use(express.static(path.join(__dirname, "public")));


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
// ================================
// middleware that checks if request has token in header ======
// ================================
function ensureAuthorization(req, res, next) {
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
// ================================
// authenticate ================
// ================================
apiRoutes.post("/signup", function (req, res) {
	User.findOne({email: req.body.email})
		.exec(function (err, existingUser) {
			if (existingUser) {
				// 409 Conflict Error
				return res.status(409).send({message: "Email or Password is taken."});
			}
			var user = new User({
				username: req.body.username,
				email: req.body.email,
				password: req.body.password
			});

			user.save(function (err, savedUser) {
				if (err) {
					// 500 Internal Server Error
					console.log(err.message);
					return res.status(500).send({message: "Email or Password is taken."});
				}

				res.send({
					token: createJwt(savedUser),
					user: savedUser.cleanUserResponse()
				});
			});

		});
});
// ================================
// Login POST ================================
// ================================
apiRoutes.post("/login", function (req, res) {

	User.findOne({email: req.body.email})
		.select("+password")
		.exec(function (err, user) {
			console.log("login user:", user.username, "req body", req.body);
			if (!user) {
				// 404 Not Found
				return res.status(404).send({message: "Invalid Email or Password."});
			}
			user.comparePassword(req.body.password, function (err, isMatch) {
				if (!isMatch) {
					console.log("ismath", isMatch);
					return res.status(401).send({message: "Invalid Email or Password."});
				}
				console.log("Login post success ----", user.username, isMatch);
				// console.log("the res", res);
				res.json({
					token: createJwt(user),
					user: user.cleanUserResponse()
				});
			});
		});
});

// ================================
// currentuser =====================
// ================================
apiRoutes.get("/me", ensureAuthorization, function (req, res) {
	User.findById(req.user)
		.exec(function (err, foundUser) {
			if (err) {
				throw err;
			}
			console.log("foundUser", foundUser);
			res.status(200).send(foundUser);
		});
});
// ================================
// profile ==========================
// ================================
apiRoutes.get("/profile", ensureAuthorization, function (req, res) {
	User.findById(req.user)
		.populate("outfits")
		.exec(function (err, foundUser) {
			var allCount = foundUser.outfits.filter(function (outfit) {
				return outfit.type === "all"
			});
			var topsCount = foundUser.outfits.filter(function (outfit) {
				return outfit.type === "tops";
			});
			var legsCount = foundUser.outfits.filter(function (outfit) {
				return outfit.type === "legs";
			});
			var shoesCount = foundUser.outfits.filter(function (outfit) {
				return outfit.type === "shoes";
			});
			var piecesCount = foundUser.outfits.filter(function (outfit) {
				return outfit.type === "pieces";
			});
			var totalCount = allCount.length + topsCount.length + legsCount.length + shoesCount.length + piecesCount.length;
			var createdAt = moment(foundUser.timestamps).format("MM-DD-YYYY");

			if (err) {
				return res.send({Message: "Error retrieving the trending current user count of types"});
			}
			// 			console.log("Sum of User types array", sumOfUserTypes);
			res.status(200).json({
				allCount: allCount.length,
				topsCount: topsCount.length,
				legsCount: legsCount.length,
				shoesCount: shoesCount.length,
				piecesCount: piecesCount.length,
				totalCount: totalCount,
				createdAt: createdAt,
				user: foundUser
			});
		})
});
// ================================
// trending ================================
// ================================
apiRoutes.get("/trending", ensureAuthorization, function (req, res) {
	console.log("the user is req.user", req.user);
	var trends = {};
	Outfit.find({})
		// - for newest first
		.sort("-timestamps")
		.limit(10)
		.exec(function (err, trendingLatest) {
			if (err) {
				console.log("Trending Error:", err);
				return res.send({Message: "Error retrieving the trending current user count of types"});
			}
			// console.log("trending", trendingLatest);
			trends.trendingLatest = trendingLatest;
			Outfit.find({})
				.where({type: "all"})
				.sort("-timestamps")
				.limit(10)
				.exec(function (err, allLatest) {
					if (err) {
						console.log("Trending Error:", err);
						return res.send({Message: "Error retrieving the trending current user count of types"});
					}
					trends.allLatest = allLatest;
					Outfit.find({})
						.where({type: "tops"})
						.sort("-timestamps")
						.limit(10)
						.exec(function (err, topsLatest) {
							if (err) {
								console.log("Trending Error:", err);
								return res.send({Message: "Error retrieving the trending current user count of types"});
							}
							trends.topsLatest = topsLatest;
							Outfit.find({})
								.where({type: "legs"})
								.sort("-timestamps")
								.limit(10)
								.exec(function (err, legsLatest) {
									if (err) {
										console.log("Trending Error:", err);
										return res.send({Message: "Error retrieving the trending current user count of types"});
									}
									trends.legsLatest = legsLatest;
									Outfit.find({})
										.where({type: "shoes"})
										.sort("-timestamps")
										.limit(10)
										.exec(function (err, shoesLatest) {
											if (err) {
												console.log("Trending Error:", err);
												return res.send({Message: "Error retrieving the trending current user count of types"});
											}
											trends.shoesLatest = shoesLatest;
											Outfit.find({})
												.where({type: "pieces"})
												.sort("-timestamps")
												.limit(10)
												.exec(function (err, piecesLatest) {
													if (err) {
														console.log("Trending Error:", err);
														return res.send({Message: "Error retrieving the trending current user count of types"});
													}
													trends.piecesLatest = piecesLatest;

													res.send(trends);
												});
										});
								});
						});
				});
		});
});
// ================================
// Discover ========================
// ================================
apiRoutes.get("/discover", function (req, res) {
	console.log("discover was hit");
	request.get("https://api.instagram.com/v1/tags/ootd/media/recent?client_id=" + process.env.clientId, function (err, respond, body) {
		// console.log("the discover body", body);
		var pictures = JSON.parse(body);
		//console.log("pictures", pictures.data)
		if (err) {
			console.log("Error retrieving pictures.", err);
			return res.status(500).send({message: "Error retrieving pictures."});
		}
		res.send(pictures.data);

	});
});

apiRoutes.get("/setup", function (req, res) {
	// create test user
	var gb = new User({
		username: "bobo",
		password: "password",
		admin: true
	});

	gb.save(function (err) {
		if (err) {
			throw err;
		}
		console.log("User saved successfully");
		res.json({success: true});
	});
});

// ================================
// Users ========================
// ================================
apiRoutes.get("/users", ensureAuthorization, function (req, res) {
	User.find({})
		.exec(function (err, users) {
			console.log("found users", users);
			res.json(users);
		});
});
// ================================
// Outfits GET ========================
// ================================
apiRoutes.get("/users/outfits", ensureAuthorization, function (req, res) {
	User.findById(req.user)
		.populate("outfits")
		.exec(function (err, foundUser) {
			// console.log(err.message);
			if (err) {
				console.log("Error Message:", err.message);
				return res.status(500).send({message: "Error finding user."});
			}
			console.log("foundUser", foundUser.username);
			res.status(200).send(foundUser);
		});
});

apiRoutes.get("/users/:id/outfits/", ensureAuthorization, function(req, res) {
	User.findById(req.user)
		.populate("outfits")
		.exec(function(err, foundUser){
			if (err) {
				console.log("Error retrieving outfits from db,", error);
				return res.status(500).send({message: "Error retrieving outfits"});
			}
			foundUser = outfitHelper(foundUser);
			console.log("Found User with outfithelper", foundUser);

			res.status(200).send(foundUser);
		});
	
});
// ================================
// Outfits POST ================================
// ================================
apiRoutes.post("/users/:id/outfits", ensureAuthorization, function (req, res) {
	// /api/v1/users/:id/outfits?pieces=1&tops=2
	console.log("req.body post", req.body);
	var outfit = new Outfit({
		imgUrl: req.body.imgUrl,
		author: req.body.author,
		type: req.body.type
	});

	Outfit.findOne({imgUrl:outfit.imgUrl, type: outfit.type})
		.exec(function (err, foundOutfit) {
			if (err) {
				console.log("Error Message: Outfit not found", err);
			}
			console.log("foundOutfit**", foundOutfit);
			if (foundOutfit) {
				foundOutfit.users.push(req.user);
				foundOutfit.save(function (err, savedOutfit) {
					if (err) {
						console.log("Error Message: Error Saving Outfit", err);
						return res.status(500).send({message: "Error Saving Oufit."});
					}
					User.findById(req.user)
						.exec(function (err, foundUser) {
							if (err) {
								console.log("Error Message: Error Finding User", err);
								return res.status(500).send({message: "Error Finding User."});
							}
							foundUser.outfits.push(savedOutfit._id);

							foundUser.save(function (err, savedUser) {
								if (err) {
									console.log("Error Message: Error Saving User", err);
									return res.status(500).send({message: "Error Saving User."});
								}
								//return the saved outfit
								res.status(201).send(savedOutfit);
							});
						});
				});
			} else {
				console.log("new outfit", outfit);
				outfit.users.push(req.user);
				outfit.save(function (err, savedOutfit) {
					if (err) {
						console.log("Error Message:", err);
						return res.status(500).send({message: "Error saving outfit."});
					}
					console.log("The saved outfit", savedOutfit);
					User.findById(req.user)
						.exec(function (err, foundUser) {
							if (err) {
								console.log("Error Message: Error Finding User", err);
								return res.status(500).send({message: "Error Finding User."});
							}
							foundUser.outfits.unshift(savedOutfit._id);

							foundUser.save(function (err, savedUser) {
								if (err) {
									console.log("Error Message: Error Saving User", err);
									return res.status(500).send({message: "Error Saving User."});
								}
								//return the saved outfit
								res.status(201).send(savedOutfit);
							});
						});
				});
			}
		});

	// outfit.save(function (err, savedOutfit) {
	// 	if (err) {
	// 		console.log("Error saving outfit to db:", err);
	// 		res.status(500).send({message: "Error saving outfit."})
	// 	}
	// 	console.log("Successful outfit saved", savedOutfit);
	// 	User.findById(req.user)
	// 		.exec(function (err, user) {
	// 			if (err) {
	// 				console.log("Error Message:", err.message);
	// 				return res.status(500).send({message: "Error finding user."});
	// 			}
	// 			user.outfits.unshift(savedOutfit._id);
	//
	// 			user.save(function (err, savedUser) {
	// 				if (err) {
	// 					console.log("Error Message:", err.message);
	// 					return res.status(500).send({message: "Error saving user."});
	// 				}
	// 				console.log("Successful outfit update");
	// 				res.status(201).send(savedOutfit);
	// 			});
	// 		});
	//
	// });
});
// ================================
// Outfit DELETE ================================
// ================================
apiRoutes.delete("/users/:id/outfits/:outfitId", ensureAuthorization, function (req, res) {
	// /api/v1/users/:id/outfits?pieces=1&tops=2
	// console.log("req.body delete", req.params	);
	var outfitId = req.params.outfitId;
	User.findById(req.user)
		.exec(function (err, foundUser) {
			if (err) {
				console.log("Error Message:", err.message);
				return res.status(500).send({message: "Error finding user."});
			}
			var index = foundUser.outfits.indexOf(outfitId);
			if (index >= 0) {
				foundUser.outfits.splice(index, 1);
			} else {
				console.log("Error outfit not in user outfits");
				return res.status(500).send({message: "Error outfit not in user outfits."});
			}
			foundUser.save(function (err, savedUser) {
				if (err) {
					console.log("Error Message:", err.message);
					return res.status(500).send({message: "Error saving user."});
				}
				Outfit.findById(outfitId)
					.exec(function(err, foundOutfit) {
						if (err) {
							console.log("Error Message:", err);
							return res.status(500).send({message: "Error finding outfit."})
						}
						var index = foundOutfit.users.indexOf(savedUser._id);

						if (index >= 0) {
							foundOutfit.users.splice(index, 1);

							if (foundOutfit.users.length === 0) {
								console.log("Last user with outfit.");
								Outfit.findOneAndRemove( foundOutfit._id)
									.exec(function (err, deletedOutfit) {
										if (err) {
											console.log("Error Message: error deleting outfit from db",err);
											return res.status(500).send({message: "Error deleting outfit from db."});
										}
											res.status(200).send(deletedOutfit);
									});
							}
						} else {
							console.log("Error user not in outfit users");
							return res.status(500).send({message: "Error user not in user outfits."});

							foundOutfit.save(function (err, savedOutfit) {
								if (err) {
									console.log("Error Message:", err.message);
									return res.status(500).send({message: "Error saving outfit."});
								}
								res.status(200).send(savedOutfit);
							});
						}
					});
			});
		});
});
// ================================
// Outfit Trends DELETE ================================
// ================================
apiRoutes.delete("/trends/outfits/:outfitId", ensureAuthorization, function (req, res) {
	// /api/v1/users/:id/outfits?pieces=1&tops=2
	console.log("req.body delete", req.params	);
	var outfitId = req.params.outfitId;
	User.findById(req.user)
		.exec(function (err, foundUser) {
			if (err) {
				console.log("Error Message:", err.message);
				return res.status(500).send({message: "Error finding user."});
			}
			Outfit.findByIdAndRemove(outfitId)
				.exec(function (err, foundOutfit) {
					if (err) {
						console.log("Error Message:", err.message);
						return res.status(500).send({message: "Error finding outfit."});
					}
					console.log("Successful delete of outfit:", foundOutfit);
					res.status(200).send({});
				});
		});
});

// ================================
// Tags ========================
// ================================
app.get("/api/v1/tags", function (req, res) {

});

app.get("/api/v1/tags/:id", function (req, res) {

});

app.use("/api/v1", apiRoutes);

// root route
apiRoutes.get("/", function (req, res) {
	res.sendFile(__dirname + "/public/index.html");
});
app.listen(port, function () {
	console.log("server running on PORT:", port);
});