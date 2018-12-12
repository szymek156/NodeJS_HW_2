const validate = require("../helpers/validate");
const _data    = require("../helpers/data");

const USER_DB = "users";
let users     = {};

// Req param: email
users.get = async function(bytes) {
    let obj   = JSON.parse(bytes.payload);
    let email = validate.parameter(obj.email, "string");

    if (!email) {
        return {status: 400, payload: "Incorect parameters"};
    }

    try {
        let user = await _data.read(USER_DB, email);
        return {status: 200, payload: user};

    } catch (err) {
        return {status: 400, payload: err};
    }
};

// Req param: name, email, address
users.post = async function(data) {
    // console.log("Received payload: ", data.payload);

    let user = JSON.parse(data.payload);

    let record = {
        name: validate.parameter(user.name, "string"),
        email: validate.parameter(user.email, "string"),
        address: validate.parameter(user.address, "string")
    }

    if (!(record.name && record.email && record.address)) {
        return {status: 400, payload: "Incorect parameters"};
    }

    try {
        await _data.create(USER_DB, record.email, record);

        return {status: 200, payload: record};

    } catch (err) {
        console.log("!!!! failed with ", err);
        return {status: 400, payload: err};
    }
};
users.put = async function(data) {
    let user = JSON.parse(data.payload);

    let update = {
        name: validate.parameter(user.name, "string"),
        email: validate.parameter(user.email, "string"),
        address: validate.parameter(user.address, "string")
    }

    if (!update.email && !(update.name || update.address)) {
        return {status: 400, payload: "Incorect parameters"};
    }

    try {
        let user = await _data.read(USER_DB, update.email);

        if (update.name) {
            user.name = update.name;
        }

        if (update.address) {
            user.address = update.address;
        }

        await _data.update(USER_DB, update.email, user);

        return {status: 200, payload: user};

    } catch (err) {
        console.log("!!!! failed with ", err);
        return {status: 400, payload: err};
    }
};
users.delete = async function(bytes) {
    let obj   = JSON.parse(bytes.payload);
    let email = validate.parameter(obj.email, "string");

    if (!email) {
        return {status: 400, payload: "Incorect parameters"};
    }

    try {
        let user = await _data.delete(USER_DB, email);
        return {status: 200, payload: user};

    } catch (err) {
        return {status: 400, payload: err};
    }
};

module.exports = users;