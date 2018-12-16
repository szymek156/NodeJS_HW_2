

// You are building the API for a pizza-delivery company. Don"t worry about a
// frontend, just build the API. Here"s the spec from your project manager:

// 1. New users can be created, their information can be edited, and they can be
// deleted. We should store their name, email address, and street address.

// 2. Users can log in and log out by creating or destroying a token.

// 3. When a user is logged in, they should be able to GET all the possible menu
// items (these items can be hardcoded into the system).

// 4. A logged-in user should be able to fill a shopping cart with menu items

// 5. A logged-in user should be able to create an order. You should integrate
// with the Sandbox of Stripe.com to accept their payment. Note: Use the stripe
// sandbox for your testing. Follow this link and click on the "tokens" tab to
// see the fake tokens you can use server-side to confirm the integration is
// working: https://stripe.com/docs/testing#cards

// 6. When an order is placed, you should email the user a receipt. You should
// integrate with the sandbox of Mailgun.com for this. Note: Every Mailgun
// account comes with a sandbox email account domain
// (whatever@sandbox123.mailgun.org) that you can send from by default. So,
// there's no need to setup any DNS for your domain for this task
// https://documentation.mailgun.com/en/latest/faqs.html#how-do-i-pick-a-domain-name-for-my-mailgun-account

const server = require("./server");

server.init();

// // Unit Testing
const TestRunner = require("./helpers/test_runner");
const TestServer = require("./tests/test_server");
const TestUser   = require("./tests/test_user");
const TestToken  = require("./tests/test_token");
const TestCart   = require("./tests/test_cart");

let runner = new TestRunner([/*TestServer, TestUser, TestToken,*/ TestCart]);

let exitNodeAfterFinish = true;
runner.runAll(exitNodeAfterFinish);



// let https           = require("https");
// const StringDecoder = require("string_decoder").StringDecoder;
// var querystring     = require("querystring");

// function callback(val) {
//     console.log(val);
// }

// let order = {
//     amount: 999,
//     currency: "usd",
//     description: "Example charge",
//     source: "tok_visa"

// };

// let stringPayload = querystring.stringify(order);

// var requestDetails = {
//     "protocol": "https:",
//     "hostname": "api.stripe.com",
//     "method": "POST",
//     "path": "/v1/charges",
//     "auth": "sk_test_4eC39HqLyjWDarjtT1zdp7dc",
//     "headers": {
//         //"Authorization": "Basic c2tfdGVzdF80ZUMzOUhxTHlqV0Rhcmp0VDF6ZHA3ZGM6",
//         "Content-Length": Buffer.byteLength(stringPayload),
//         "User-Agent": "curl / 7.47.0",
//         "Accept": "*/*",
//         "Content-Type": "application/x-www-form-urlencoded"
//     }
// };


// var req = https.request(requestDetails, function(res) {
//     // Grab the status of the sent request
//     var status = res.statusCode;
//     // Callback successfully if the request went through

//     let decoder = new StringDecoder("utf-8");
//     let buffer  = "";

//     res.on("data", function(chunk) {
//         buffer += decoder.write(chunk);
//     });
//     res.on("end", function() {
//         buffer += decoder.end();
//         callback(buffer);
//     });

//     if (status == 200 || status == 201) {
//         callback(false);
//     } else {
//         callback("Status code returned was " + status);
//     }
// });

// // Bind to the error event so it doesn't get thrown
// req.on("error", function(e) {
//     callback(e);
// });

// // Add the payload
// req.write(stringPayload);

// // End the request
// req.end();