
let users = {};

users.get = async function(data) { return {status : 200, payload : {}}; };

users.post = async function(data) {
    console.log('Received payload: ', data.payload);
    return {status : 200, payload : JSON.parse(data.payload)};
};
users.put = async function(data) {

};
users.delete = async function(data) {

};
module.exports = users;