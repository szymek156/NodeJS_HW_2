const http        = require("http");
const config      = require("../config");
const assert      = require("assert");
const TestBase    = require("./test_base");
const querystring = require("querystring");

class TestUser extends TestBase {
    tearDown() {
        // Cleanup
    }

    async createUser(user) {
        let requestDetails = {
            protocol: "http:",
            hostname: "localhost",
            method: "POST",
            path: "/users",
            port: config.port
        };

        return await this.syncRequest(requestDetails, JSON.stringify(user));
    }

    async getUser(email) {
        let getData = JSON.stringify(email);


        let requestDetails = {
            protocol: "http:",
            hostname: "localhost",
            method: "GET",
            path: "/users",
            port: config.port,
            headers:
                {"Content-Type": "application/json", "Content-Length": Buffer.byteLength(getData)}
        };

        return await this.syncRequest(requestDetails, getData);
    }

    async testUserCanBeCreatedAndFetched() {
        let user = {name: "Simon", email: "Simon@theClouds.com", address: "5th Ave str"};

        let {res, payload} = await this.createUser(user);

        let postUser = JSON.parse(payload);

        assert(res.statusCode == 200);
        assert(user.toString() === postUser.toString());

        let {res: getRes, payload: getPayload} = await this.getUser({email: user.email});

        let getUser = JSON.parse(getPayload);

        assert(getRes.statusCode == 200);
        assert(user.toString() === getUser.toString());
    }

    async testUserWithMissingPropsCannotBeCreated() {
        let user = {name: "Andrew", email: "Andrew@theClouds.com"};

        let {res, payload} = await this.createUser(user);

        assert(res.statusCode == 400);

        let {res: getRes, payload: getPayload} = await this.getUser({email: user.email});

        assert(getRes.statusCode == 400);
    }

    async testUserCannotBeCreatedTwice() {
        let user = {name: "Crystal", email: "Crystal@theClouds.com", address: "5th Ave str"};

        let {res, payload} = await this.createUser(user);

        assert(res.statusCode == 200);

        let {res: res2, payload: payload2} = await this.createUser(user);

        assert(res2.statusCode == 400);
    }
}

module.exports = TestUser;