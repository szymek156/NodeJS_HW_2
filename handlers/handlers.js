let handlers = {};

handlers.hello = async function(data) {
    let response = {status: 400, payload: "Bad request"};

    if (data.method === "post") {
        response.status = 200;

        if (data.payload && data.payload.length > 0) {
            response.payload = `Echo! Your payload: ${JSON.stringify(data.payload)}`;
        } else {
            response.payload = "Echo! Nothing in payload :O";
        }
    }

    // return Promise.resolve(response) -> JS does this automagically
    return response;
};

handlers.notFound = async function() {
    return {status: 404, payload: "Not found"};
};

handlers.echo = async function() {
    console.log("ECHO!!!");
    return {status: 200, payload: "echo!"};
};

module.exports = handlers;