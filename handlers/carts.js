const validate = require("../helpers/validate");
const _data    = require("../helpers/data");
const config   = require("../config");

const CART_DB = config.CART_DB;

let cart = {};

// Req param: email, tokenId === cartId
cart.get = async function(bytes) {
    let obj   = JSON.parse(bytes.payload);
    let email = validate.parameter(obj.email, "string");
    let token = validate.parameter(bytes.headers.token, "string");

    if (!email && !token) {
        return {status: 400, payload: "Incorect parameters"};
    }

    try {
        if (!await validate.token(token, email)) {
            return {status: 400, payload: "Invalid token"};
        }

        let cart = await _data.read(CART_DB, token);

        return {status: 200, payload: cart};

    } catch (err) {
        return {status: 400, payload: err};
    }
};

// Req param: email, tokenId===cartId
cart.post = async function(data) {
    let obj   = JSON.parse(data.payload);
    let email = validate.parameter(obj.email, "string");
    let token = validate.parameter(data.headers.token, "string");

    if (!email && !token) {
        return {status: 400, payload: "Incorect parameters"};
    }

    try {
        if (!await validate.token(token, email)) {
            return {status: 400, payload: "Invalid token"};
        }

        let   record = {};
        await _data.create(CART_DB, token, record);

        return {status: 200, payload: record};

    } catch (err) {
        console.log("!!!! failed with ", err);
        return {status: 400, payload: err};
    }
};

// Req param email, token, cart
cart.put = async function(data) {
    let obj   = JSON.parse(data.payload);
    let email = validate.parameter(obj.email, "string");
    let token = validate.parameter(data.headers.token, "string");
    let cart  = validate.parameter(obj.cart, "object");

    if (!email && !token && !cart) {
        return {status: 400, payload: "Incorect parameters"};
    }

    try {
        if (!await validate.token(token, email)) {
            return {status: 400, payload: "Invalid token"};
        }

        await _data.update(CART_DB, token, cart);

        return {status: 200, payload: cart};

    } catch (err) {
        console.log("!!!! failed with ", err);
        return {status: 400, payload: err};
    }
};

// Req param: phone, tokenId
cart.delete = async function(bytes) {
    let obj   = JSON.parse(bytes.payload);
    let email = validate.parameter(obj.email, "string");
    let token = validate.parameter(bytes.headers.token, "string");

    if (!email && !token) {
        return {status: 400, payload: "Incorect parameters"};
    }

    try {
        if (!await validate.token(token, email)) {
            return {status: 400, payload: "Invalid token"};
        }

        await _data.delete(CART_DB, token);

        return {status: 200, payload: {}};

    } catch (err) {
        console.log("!!!! failed with ", err);
        return {status: 400, payload: err};
    }
};

module.exports = cart;