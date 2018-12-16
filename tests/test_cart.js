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

    async testCartCanBeCreated() {
        let {res, payload} = await Common.createCart({email: this.user.email}, {id: this.token.id});

        assert(res.statusCode === 200);
        assert(payload === "{}");
    }

    async testCartCanBeUpdatedAndFetched() {
        let {res, payload} = await Common.createCart({email: this.user.email}, {id: this.token.id});

        assert(res.statusCode === 200);
        assert(payload === "{}");

        let {res: menuRes, payload: menuPayload} =
            await Common.getMenu({email: this.user.email}, {id: this.token.id});

        assert(res.statusCode === 200);

        let menu = JSON.parse(menuPayload);

        let cart = {items: [menu.salads[0], menu.pizzas[1]]};

        let {res: resUpdate, payload: payloadUpdate} =
            await Common.updateCart({email: this.user.email, cart: cart}, {id: this.token.id});

        assert(resUpdate.statusCode === 200);
        assert(payloadUpdate === JSON.stringify(cart));

        let {res: resGet, payload: payloadGet} =
            await Common.getCart({email: this.user.email}, {id: this.token.id});

        assert(resGet.statusCode === 200);
        assert(payloadGet === JSON.stringify(cart));
    }

    async testCartCanBeDeleted() {
        let {res, payload} = await Common.createCart({email: this.user.email}, {id: this.token.id});

        assert(res.statusCode === 200);
        assert(payload === "{}");

        let {res: resDel, payload: payloadDel} =
            await Common.deleteCart({email: this.user.email}, {id: this.token.id});

        assert(resDel.statusCode === 200);

        let {res: resGet, payload: payloadGet} =
            await Common.getCart({email: this.user.email}, {id: this.token.id});

        assert(resGet.statusCode === 400);
    }


    async testCartProceedToCheckout() {
        await Common.createCart({email: this.user.email}, {id: this.token.id});

        let {res: menuRes, payload: menuPayload} =
            await Common.getMenu({email: this.user.email}, {id: this.token.id});

        let menu = JSON.parse(menuPayload);

        let cart = {items: [menu.salads[0], menu.pizzas[1]]};

        await Common.updateCart({email: this.user.email, cart: cart}, {id: this.token.id});

        let {res: checkoutRes, payload: checkoutPayload} =
            await Common.postCart({email: this.user.email}, {id: this.token.id});


        assert(checkoutRes.statusCode === 200);
    }
}

module.exports = TestCart;