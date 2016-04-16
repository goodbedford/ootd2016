var mongoose    = require("mongoose");
var Schema      = mongoose.Schema;
var User        = require("./user.js");

var OutfitSchema = new Schema({
    imgUrl:{type: String, required: true, lowercase: true},
    author: {type: String, required: true, lowercase: true},
    type: {type: String, required: true, lowercase: true},
    users: [{type: Schema.Types.ObjectId, ref: "User"}],
    timestamps: {type: Date, default: Date.now}
});


var Outfit = mongoose.model("Outfit", OutfitSchema);

module.exports = Outfit;
