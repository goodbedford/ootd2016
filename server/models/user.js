var mongoose    = require("mongoose");
var Schema      = mongoose.Schema;
var Outfit     = require("./outfit.js");
var bcrypt      = require("bcrypt");
var UserSchema = new Schema({
    username:{type: String, required: true, lowercase: true, index: {unique: true}},
    email: {type: String, required: true, lowercase: true, index: {unique: true}},
    password: {type: String, required: true, select: false},
    admin: Boolean,
    // createdAt: {type: Date, default: Date.now}
    outfits: [{type: Schema.Types.ObjectId, ref: "Outfit"}],
    timestamps: {type: Date, default: Date.now}

});

// hash password before the user is saved
UserSchema.pre("save", function(next) {
    var user = this;
    console.log("this pre save started", user);
    if (!user.isModified("password")) {
        console.log("password not modified.");
        return next();
    }

    // hash password
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(user.password, salt, function(err, hash) {
            // if (err) {
            //     console.log("some error with bcrypt");
            //     return next(err);
            // }
            // set hash as password
            user.password = hash;

            console.log("inside bcrypt hasher",user);
            next();
        });
    });
});

// method to compare password with the database hash
UserSchema.methods.comparePassword = function(password, done) {
    var user = this;

    bcrypt.compare(password, user.password, function(err, isMatch) {
        console.log("inner bcrypt isMatch:", isMatch);
        done(err, isMatch);
    });
};
// method to remove password for sending back json on response
UserSchema.methods.cleanUserResponse = function() {
    var user = this;

    return {
        _id: this._id,
        username: this.username,
        email: this.email,
    };
};

var User = mongoose.model("User", UserSchema);

module.exports = User;