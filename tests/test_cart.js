const assert   = require("assert");
const TestBase = require("./test_base");
const Common   = require("./common");

class TestCart extends TestBase {
    async setUp() {
        // Create and login user
        this.user = {
            name: "Joey",
            email: "Joey@theClouds.com",
            address: "Redmond",
            password: "strong password"
        };

        let {res, payload} = await Common.createUser(this.user);
        assert(res.statusCode === 200);

        let {res: tokenRes, payload: tokenPayload} =
            await Common.createToken({email: this.user.email, password: this.user.password});

        assert(tokenRes.statusCode === 200);
        this.token = JSON.parse(tokenPayload);
    }

    tearDown() {
        Common.cleanDB("users");
        Common.cleanDB("tokens");
    }

    async testCartDummy() {
        console.log("resultato");
    }
}

module.exports = TestCart;