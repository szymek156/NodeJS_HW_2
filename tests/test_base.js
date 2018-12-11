const http          = require("http");
const StringDecoder = require("string_decoder").StringDecoder;

class TestBase {
    constructor() {}

    setUp() {}

    tearDown() {}

    async syncRequest(requestDetails, payload) {
        return new Promise((resolve) => {
            let req = http.request(requestDetails, function(res) {
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

            req.on("error", (e) => {
                console.error(`!!!!!!!!!!!!!! problem with request: ${e.message}`);
            });

            if (payload) {
                req.write(payload);
            }
            req.end();
        });
    };
}

module.exports = TestBase;