
const http   = require("http");
const config = require("../config");
const assert = require("assert");

class TestServer {
    constructor() {
        this.counter = 0;
    }

    setUp() {
        console.log("setUp", this.counter++);
    }

    tearDown() {
        console.log("tearDown");
    }


    async testServerIsUpAndRunning() {
        let syncRequest = async function() {
            return new Promise((resolve) => {
                let requestDetails = {
                    protocol: "http:",
                    hostname: "localhost",
                    method: "GET",
                    path: "/echo",
                    port: config.port
                };

                let req = http.request(requestDetails, function(res) {
                    let status = res.statusCode;
                    resolve(status);
                });

                req.end();
            });
        };

        let result = await syncRequest();

        assert(result === 200);
    }

    testServerReturns404OnUnkownEndpoint() {
        assert(false, "here is message");
    }
}

module.exports = TestServer;
