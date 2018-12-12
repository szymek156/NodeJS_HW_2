const path = require("path");

let environments = {
    production: {port: 3000, DB_ROOT: path.join(__dirname, "./.data")},

    development: {port: 3000, DB_ROOT: path.join(__dirname, "./.data_test")}
};


let currentEnv = process.env.NODE_ENV ? process.env.NODE_ENV.toLowerCase() : "";

let selectedEnv = currentEnv in environments ? environments[currentEnv] : environments.development;

module.exports = selectedEnv;