var randomstring = require("randomstring");
var random = function (length, charset, capitalization) {
    return randomstring.generate({
        length: length,
        charset: charset,
        capitalization: capitalization
    });
}

module.exports = {
    new: random
};