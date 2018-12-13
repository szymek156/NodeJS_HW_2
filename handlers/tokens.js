const validate = require("../helpers/validate");
const _data    = require("../helpers/data");
const helpers  = require("../helpers/helpers");

const TOKEN_DB = "tokens";
const USER_DB  = "users";

let tokens = {};

// Req param: email
tokens.get = async function(data) {
    let payload = JSON.parse(data.payload);

    let record = {
        password: validate.parameter(payload.password, "string"),
        email: validate.parameter(payload.email, "string"),
    }

    if (!(record.email && record.password)) {
        return {status: 400, payload: "Incorect parameters"};
    }

    try {
        let user = await _data.read(USER_DB, record.email);

        let hashed = helpers.hash(record.password);

        if (hashed !== user.password) {
            return {status: 400, payload: "Invalid login"};
        }

        let token = await _data.read(TOKEN_DB, record.email);

        delete token.password;

        return {status: 200, payload: token};

    } catch (err) {
        console.log("!!!! failed with ", err);
        return {status: 400, payload: err};
    }
};

// Req param: email, password
tokens.post = async function(data) {
    let payload = JSON.parse(data.payload);

    let record = {
        password: validate.parameter(payload.password, "string"),
        email: validate.parameter(payload.email, "string"),
    }

    if (!(record.email && record.password)) {
        return {status: 400, payload: "Incorect parameters"};
    }

    try {
        let user = await _data.read(USER_DB, record.email);

        let hashed = helpers.hash(record.password);

        if (hashed !== user.password) {
            return {status: 400, payload: "Invalid login"};
        }

        let token = {
            tokenId: helpers.createRandomString(20),
            expires: Date.now() + 1000 * 60 * 60,
            password: hashed
        };


        await _data.create(TOKEN_DB, record.email, token);

        delete token.password;

        return {status: 200, payload: token};

    } catch (err) {
        console.log("!!!! failed with ", err);
        return {status: 400, payload: err};
    }
};

// Req params: email, extend
tokens.put = async function(data) {
    let payload = JSON.parse(data.payload);

    let record = {
        extend: validate.parameter(payload.extend, "boolean"),
        email: validate.parameter(payload.email, "string"),
    }

    if (!(record.email && record.extend)) {
        return {status: 400, payload: "Incorect parameters"};
    }

    try {
        let token = await _data.read(TOKEN_DB, record.email);

        if (token.expires > Date.now()) {
            token.expires = Date.now() * 1000 * 60 * 60;

            await _data.update(TOKEN_DB, record.email, token);
            return {status: 200, payload: token};
        } else {
            return {status: 400, payload: "Token expired"};
        }
    } catch (err) {
        console.log("!!!! failed with ", err);
        return {status: 400, payload: err};
    }
};

tokens.delete = async function(bytes) {
    let obj   = JSON.parse(bytes.payload);
    let email = validate.parameter(obj.email, "string");

    if (!email) {
        return {status: 400, payload: "Incorect parameters"};
    }

    try {
        await _data.delete(TOKEN_DB, email);
        return {status: 200, payload: {}};

    } catch (err) {
        return {status: 400, payload: err};
    }
};

module.exports = tokens;