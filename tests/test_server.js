
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

    async syncRequest(requestDetails) {
        return new Promise((resolve) => {
            let req = http.request(requestDetails, function(res) {
                let status = res.statusCode;
                resolve(status);
            });

            req.end();
        });
    };

    async testServerIsUpAndRunning() {
        let requestDetails = {
            protocol: "http:",
            hostname: "localhost",
            method: "GET",
            path: "/echo",
            port: config.port
        };

        let result = await this.syncRequest(requestDetails);

        assert(result === 200);
    }

    async testServerReturns404OnUnkownEndpoint() {
        let requestDetails = {
            protocol: "http:",
            hostname: "localhost",
            method: "GET",
            path: "/unknownEndpoint",
            port: config.port
        };

        let result = await this.syncRequest(requestDetails);

        assert(result === 404);
    }
}

module.exports = TestServer;
