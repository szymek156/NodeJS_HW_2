const assert   = require("assert");
const TestBase = require("./test_base");
const Common   = require("./common");

class TestUser extends TestBase {
    tearDown() {
        Common.cleanDB("users");
        Common.cleanDB("tokens");
    }

    async testUserCanBeCreatedAndFetched() {
        let user = {
            name: "Simon",
            email: "Simon@theClouds.com",
            address: "5th Ave str",
            password: "StrongPassword"
        };
        let {res, payload} = await Common.createUser(user);

        let postUser = JSON.parse(payload);

        delete user.password;
        console.log("res.status code ", JSON.stringify(user), " \n", JSON.stringify(postUser));

        assert(res.statusCode == 200);
        assert(postUser.password === undefined);
        assert(JSON.stringify(user) === JSON.stringify(postUser));

        let {res: getRes, payload: getPayload} = await Common.getUser({email: user.email});

        let getUser = JSON.parse(getPayload);

        assert(getRes.statusCode == 200);
        assert(getUser.password === undefined);
        assert(JSON.stringify(user) === JSON.stringify(getUser));
    }

    async testUserWithMissingPropsCannotBeCreated() {
        let                        user = {name: "Andrew", email: "Andrew@theClouds.com"};
        let {res, payload}              = await Common.createUser(user);

        assert(res.statusCode == 400);

        let {res: getRes, payload: getPayload} = await Common.getUser({email: user.email});

        assert(getRes.statusCode == 400);
    }

    async testUserWithInvalidPropsCannotBeCreated() {
        let user           = {name: "Andrew", email: "Andrew@theClouds.com", address: 345};
        let {res, payload} = await Common.createUser(user);

        assert(res.statusCode == 400);

        let {res: getRes, payload: getPayload} = await Common.getUser({email: user.email});

        assert(getRes.statusCode == 400);
    }

    async testUserCannotBeCreatedTwice() {
        let user = {
            name: "Crystal",
            email: "Crystal@theClouds.com",
            address: "5th Ave str",
            password: "StrongPassword"
        };
        let {res, payload} = await Common.createUser(user);

        assert(res.statusCode == 200);

        let {res: res2, payload: payload2} = await Common.createUser(user);

        assert(res2.statusCode == 400);
    }

    async testUserCannotBeCreatedEmpty() {
        let user = {};

        let {res, payload} = await Common.createUser(user);

        assert(res.statusCode == 400);
    }

    async testUserCanBeUpdated() {
        let user = {
            name: "Joey",
            email: "Joey@theClouds.com",
            address: "Redmond",
            password: "strong password"
        };
        let {res, payload} = await Common.createUser(user);

        delete user.password;

        assert(res.statusCode == 200);

        user.name                                                 = "Kevin";
        let {res: resName, payload: payloadName}                  = await Common.updateUser(user);
        let                                              userName = JSON.parse(payloadName);

        assert(resName.statusCode == 200);
        assert(JSON.stringify(user) === JSON.stringify(userName));

        user.address                                   = "Seattle";
        let {res: resAddress, payload: payloadAddress} = await Common.updateUser(user);
        let userAddress                                = JSON.parse(payloadAddress);

        assert(resAddress.statusCode == 200);
        assert(JSON.stringify(user) === JSON.stringify(userAddress));
    }

    async testUserCanBeUpdatedAllAtOnce() {
        let user = {
            name: "Joey",
            email: "Joey@theClouds.com",
            address: "Redmond",
            password: "strong password"
        };

        let {res, payload} = await Common.createUser(user);
        delete user.password;

        assert(res.statusCode == 200);

        user.name                                    = "Kevin";
        user.address                                 = "Seattle";
        let {res: resUpdate, payload: payloadUpdate} = await Common.updateUser(user);
        let                                                  userUpdate = JSON.parse(payloadUpdate);

        assert(resUpdate.statusCode == 200);
        assert(JSON.stringify(user) === JSON.stringify(userUpdate));
    }

    async testUserCantUpdateNothing() {
        let user = {
            name: "Daep",
            email: "Daep@theClouds.com",
            address: "Northen Cascades",
            password: "strong password"
        };

        let {res, payload} = await Common.createUser(user);

        assert(res.statusCode == 200);

        let {res: resUpdate, payload: payloadUpdate} = await Common.updateUser({});

        assert(resUpdate.statusCode == 400);
    }

    async testUserCanBeDeleted() {
        let user = {
            name: "Daep",
            email: "Daep@theClouds.com",
            address: "Northen Cascades",
            password: "StrongPassword"
        };

        let {res, payload} = await Common.createUser(user);

        assert(res.statusCode == 200);

        let {res: resDelete, payload: payloadDelete} = await Common.deleteUser({email: user.email});

        assert(resDelete.statusCode == 200);
    }

    async testUserCantBeDeletedIfNotExists() {
        let user = {name: "Daep", email: "Daep@theClouds.com", address: "Northen Cascades"};

        let {res: resDelete, payload: payloadDelete} = await Common.deleteUser({email: user.email});

        assert(resDelete.statusCode == 400);
    }
}

module.exports = TestUser;