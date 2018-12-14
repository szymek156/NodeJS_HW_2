const path = require("path");

let environments = {
    production: {
        port: 3000,
        DB_ROOT: path.join(__dirname, "./.data"),
        USER_DB: "users",
        TOKEN_DB: "tokens",
        hashingSecret: "this is secret",
    },

    development: {
        port: 3000,
        DB_ROOT: path.join(__dirname, "./.data_test"),
        USER_DB: "users",
        TOKEN_DB: "tokens",
        hashingSecret: "this is development secret",
        developmentEnv: true
    }
};


let currentEnv = process.env.NODE_ENV ? process.env.NODE_ENV.toLowerCase() : "";

let selectedEnv = currentEnv in environments ? environments[currentEnv] : environments.development;

module.exports = selectedEnv;