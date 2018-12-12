const config      = require("../config");
const assert      = require("assert");
const TestBase    = require("./test_base");
const querystring = require("querystring");
const path        = require("path");
const fs          = require("fs");

class TestUser extends TestBase {
    tearDown() {
        let dir   = path.join(config.DB_ROOT, "users")
        let files = fs.readdirSync(dir);

        for (const file of files) {
            fs.unlinkSync(path.join(dir, file));
        }
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

    async updateUser(user) {
        let strUser = JSON.stringify(user);

        let requestDetails = {
            protocol: "http:",
            hostname: "localhost",
            method: "PUT",
            path: "/users",
            port: config.port,
            headers:
                {"Content-Type": "application/json", "Content-Length": Buffer.byteLength(strUser)}
        };

        return await this.syncRequest(requestDetails, strUser);
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

    async testUserWithInvalidPropsCannotBeCreated() {
        let user = {name: "Andrew", email: "Andrew@theClouds.com", address: 345};

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

    async testUserCannotBeCreatedEmpty() {
        let user = {};

        let {res, payload} = await this.createUser(user);

        assert(res.statusCode == 400);
    }

    async testUserCanBeUpdated() {
        let user = {name: "Joey", email: "Joey@theClouds.com", address: "Redmond"};

        let {res, payload} = await this.createUser(user);

        assert(res.statusCode == 200);

        user.name                                = "Kevin";
        let {res: resName, payload: payloadName} = await this.updateUser(user);
        let userName                             = JSON.parse(payloadName);

        assert(resName.statusCode == 200);
        assert(user.toString() === userName.toString());

        user.address                                   = "Seattle";
        let {res: resAddress, payload: payloadAddress} = await this.updateUser(user);
        let userAddress                                = JSON.parse(payloadAddress);

        assert(resAddress.statusCode == 200);
        assert(user.toString() === userAddress.toString());
    }

    async testUserCanBeUpdatedAllAtOnce() {
        let user = {name: "Joey", email: "Joey@theClouds.com", address: "Redmond"};

        let {res, payload} = await this.createUser(user);

        assert(res.statusCode == 200);

        user.name                                    = "Kevin";
        user.address                                 = "Seattle";
        let {res: resUpdate, payload: payloadUpdate} = await this.updateUser(user);
        let userUpdate                               = JSON.parse(payloadUpdate);

        assert(resUpdate.statusCode == 200);
        assert(user.toString() === userUpdate.toString());
    }

    async testUserCantUpdateNothing() {
        let user = {name: "Daep", email: "Daep@theClouds.com", address: "Northen Cascades"};

        let {res, payload} = await this.createUser(user);

        assert(res.statusCode == 200);

        let {res: resUpdate, payload: payloadUpdate} = this.updateUser({});

        assert(resUpdate.statusCode == 400);
    }
}

module.exports = TestUser;