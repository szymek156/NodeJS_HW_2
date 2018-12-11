const _users = require("./users");

let handlers = {};

handlers.users = async function(data) {
    let method = data.method;

    if (method in _users) {
        return await _users[method](data);
    } else {
        return await handlers.badRequest();
    }
};

handlers.notFound   = async function() { return {status : 404, payload : "Not found"}; };
handlers.badRequest = async function() { return {status : 400, payload : "Bad request"}; };

handlers.echo = async function() {
    console.log("ECHO!!!");
    return {status : 200, payload : "echo!"};
};

module.exports = handlers;