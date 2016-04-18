
function outfitHelper( foundUser) {
	var outfit = {};
	var allTypes = foundUser.outfits.filter(function (outfit) {
		return outfit.type === "all";
	});
	var topsTypes = foundUser.outfits.filter(function (outfit) {
		return outfit.type === "tops";
	});
	var legsTypes = foundUser.outfits.filter(function (outfit) {
		return outfit.type === "legs";
	});
	var shoesTypes = foundUser.outfits.filter(function (outfit) {
		return outfit.type === "shoes";
	});
	var piecesTypes = foundUser.outfits.filter(function (outfit) {
		return outfit.type === "pieces";
	});
	
	outfit.allTypes = allTypes;
	outfit.topsTypes = topsTypes;
	outfit.legsTypes = legsTypes;
	outfit.shoesTypes = shoesTypes;
	outfit.piecesTypes = piecesTypes;
	
	return outfit;
}

module.exports = outfitHelper;