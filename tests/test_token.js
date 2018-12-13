
const assert   = require("assert");
const TestBase = require("./test_base");
const Common   = require("./common");

class TestToken extends TestBase {
    tearDown() {
        Common.cleanDB("users");
        Common.cleanDB("tokens");
    }

    async testTokenCanBeCreatedAndFetched() {
        let user = {
            name: "Simon",
            email: "Simon@theClouds.com",
            address: "5th Ave str",
            password: "StrongPassword"
        };

        let {res, payload} = await Common.createUser(user);

        assert(res.statusCode == 200);

        let {res: tokenRes, payload: tokenPayload} =
            await Common.createToken({email: user.email, password: user.password});

        assert(tokenRes.statusCode == 200);

        let {res: tokenResGet, payload: tokenPayloadGet} =
            await Common.getToken({email: user.email, password: user.password});

        assert(tokenResGet.statusCode == 200);
    }

    async testTokenCantBeCreatedOnWrongCredentials() {
        let user = {
            name: "Simon",
            email: "Simon@theClouds.com",
            address: "5th Ave str",
            password: "StrongPassword"
        };

        let {res, payload} = await Common.createUser(user);

        assert(res.statusCode == 200);

        let {res: tokenRes, payload: tokenPayload} =
            await Common.createToken({email: user.email, password: "wrong pass"});

        assert(tokenRes.statusCode == 400);

        let {res: tokenResEmail, payload: tokenPayloadEmail} =
            await Common.createToken({email: "wrong@email", password: user.password});

        assert(tokenResEmail.statusCode == 400);
    }

    async testTokenCantBeCreatedWithoutUser() {
        let user = {
            name: "Simon",
            email: "NonExisting@theClouds.com",
            address: "5th Ave str",
            password: "StrongPassword"
        };

        let {res: tokenRes, payload: tokenPayload} =
            await Common.createToken({email: user.email, password: user.password});

        assert(tokenRes.statusCode == 400);
    }

    async testTokenCanBeExtended() {
        let user = {
            name: "Simon",
            email: "Simon@theClouds.com",
            address: "5th Ave str",
            password: "StrongPassword"
        };

        let {res, payload} = await Common.createUser(user);

        assert(res.statusCode == 200);

        let {res: tokenRes, payload: tokenPayload} =
            await Common.createToken({email: user.email, password: user.password});

        assert(tokenRes.statusCode == 200);

        let {res: tokenResPut, payload: tokenPayloadPut} =
            await Common.updateToken({email: user.email, extend: true});

        assert(tokenResPut.statusCode == 200);
    }

    async testTokenCanBeDeleted() {
        let user = {
            name: "Simon",
            email: "Simon@theClouds.com",
            address: "5th Ave str",
            password: "StrongPassword"
        };

        let {res, payload} = await Common.createUser(user);

        assert(res.statusCode == 200);

        let {res: tokenRes, payload: tokenPayload} =
            await Common.createToken({email: user.email, password: user.password});

        assert(tokenRes.statusCode == 200);

        let {res: tokenResDelete, payload: tokenPayloadDelete} =
            await Common.deleteToken({email: user.email});

        assert(tokenResDelete.statusCode == 200);
    }
}

module.exports = TestToken;