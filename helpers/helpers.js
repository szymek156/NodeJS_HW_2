const crypto = require("crypto");
const config = require("../config");

let helpers = {};

helpers.hash = function(str) {
    let hash = crypto.createHmac("sha256", config.hashingSecret).update(str).digest("hex");
    return hash;
};

helpers.parseJsonToObject = function(str) {
    try {
        let obj = JSON.parse(str);
        return obj;
    } catch (err) {
        return {};
    }
};

helpers.createRandomString = function(strLen) {
    if (strLen) {
        let possibleChars = "abcdefghijklmnopqrstuvwxyz0123456s789";
        let str           = "";

        for (let i = 1; i <= strLen; i++) {
            let randomChar = possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));

            str += randomChar;
        }

        return str;
    } else {
        return false;
    }
};

helpers.validateParameter = function(parameter, type, possibleValues = [], instance = undefined) {
    if (typeof (parameter) !== type) {
        return false;
    }

    if (typeof (parameter) === "string") {
        parameter = parameter.trim();
        if (parameter.length == 0) {
            return false;
        }
    }

    if (possibleValues.length > 0) {
        if (possibleValues.indexOf(parameter) == -1) {
            return false;
        }
    }

    if (instance && !parameter instanceof instance) {
        return false;
    }

    return parameter;
};


module.exports = helpers;
