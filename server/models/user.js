var mongoose    = require("mongoose");
var Schema      = mongoose.Schema;
var bcrypt      = require("bcrypt");
var salt        = bcrypt.genSalt(10);

var UserSchema = new Schema({
    username:{type: String, required: true, index: {unique: true}},
    password: {type: String, required: true},
    admin: Boolean,
    createdAt: {type: Date, default: Date.now}
});

// hash password before the user is saved
UserSchema.pre("save", function(next) {
    var user = this;
    console.log("this pre save started", user);
    if (!user.isModified("password")) {
        return next();
    }

    // hash password
    bcrypt.genSalt(function(err, salt) {
        bcrypt.hash(user.password, salt, function(err,hash) {
            if (err) {
                return next(err);
            }
            // set hash as password
            user.password = hash;
            return next();
        });
    });
});

// method to compare password with the database hash
UserSchema.methods.comparePassword = function(password) {
    var user = this;

    return bcrypt.compareSync(password, user.password);
};

var User = mongoose.model("User", UserSchema);

module.exports = User;