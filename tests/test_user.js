const http     = require('http');
const config   = require('../config');
const assert   = require('assert');
const TestBase = require('./test_base');

class TestUser extends TestBase {

    async testUserCanBeFetched() {
        let requestDetails = {
            protocol : 'http:',
            hostname : 'localhost',
            method : 'GET',
            path : '/users',
            port : config.port
        };

        let {res, payload} = await this.syncRequest(requestDetails);

        assert(res.statusCode == 200);
    }

    async testUserCanBeCreated() {
        let requestDetails = {
            protocol : 'http:',
            hostname : 'localhost',
            method : 'POST',
            path : '/users',
            port : config.port
        };

        let user = {name : 'name', email : 'email', address : 'address'};

        let {res, payload} = await this.syncRequest(requestDetails, JSON.stringify(user));

        let resUser = JSON.parse(payload);

        assert(res.statusCode == 200);
        assert(user.toString() === resUser.toString());
    }
}

module.exports = TestUser;