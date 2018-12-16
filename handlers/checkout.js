const validate      = require("../helpers/validate");
const _data         = require("../helpers/data");
const config        = require("../config");
const StringDecoder = require("string_decoder").StringDecoder;
const querystring   = require("querystring");
const https         = require("https");

const CART_DB = config.CART_DB;
let checkout  = {};

// Req param: email, tokenId
checkout.post = async function(bytes) {
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

        // Get cart
        let cart = await _data.read(CART_DB, token);

        let amount = cart.items.reduce((total, item) => total + item.price, 0);

        let order = {
            amount: amount * 100,  // Stripe expects amount in pence
            currency: "usd",
            description: "Order ID: " + token,
            source: "tok_visa"
        };

        let answer = await checkout.placeOrder(order);

        console.log(answer.res.statusCode);
        console.log(answer.payload);
        return {status: answer.res.statusCode, payload: answer.payload};


    } catch (err) {
        return {status: 400, payload: err};
    }
};

checkout.placeOrder = async function(order) {
    let stringPayload = querystring.stringify(order);

    let requestDetails = {
        "protocol": "https:",
        "hostname": "api.stripe.com",
        "method": "POST",
        "path": "/v1/charges",
        "auth": "sk_test_4eC39HqLyjWDarjtT1zdp7dc",
        "headers": {
            //"Authorization": "Basic c2tfdGVzdF80ZUMzOUhxTHlqV0Rhcmp0VDF6ZHA3ZGM6",
            "Content-Length": Buffer.byteLength(stringPayload),
            "User-Agent": "node",
            "Accept": "*/*",
            "Content-Type": "application/x-www-form-urlencoded"
        }
    };

    return new Promise((resolve, reject) => {
        let req = https.request(requestDetails, function(res) {
            // Callback successfully if the request went through
            let decoder = new StringDecoder("utf-8");
            let buffer  = "";

            res.on("data", function(chunk) {
                buffer += decoder.write(chunk);
            });
            res.on("end", function() {
                buffer += decoder.end();
                resolve({res: res, payload: buffer});
            });
        });

        // Bind to the error event so it doesn't get thrown
        req.on("error", function(e) {
            reject(e);
        });

        // Add the payload
        req.write(stringPayload);

        // End the request
        req.end();
    });
};


module.exports = checkout;