let validate = {};

validate.parameter = function(parameter, type, possibleValues = [], instance = undefined) {
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

module.exports = validate;