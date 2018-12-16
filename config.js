const path = require("path");

let environments = {
    _common: {USER_DB: "users", TOKEN_DB: "tokens", MENU_DB: "menu", CART_DB: "carts"},

    production:
        {port: 3000, DB_ROOT: path.join(__dirname, "./.data"), hashingSecret: "this is secret"},

    development: {
        port: 3000,
        DB_ROOT: path.join(__dirname, "./.data_test"),
        hashingSecret: "this is development secret",
        developmentEnv: true
    }
};

Object.setPrototypeOf(environments.production, environments._common);
Object.setPrototypeOf(environments.development, environments._common);

let currentEnv = process.env.NODE_ENV ? process.env.NODE_ENV.toLowerCase() : "";

let selectedEnv = currentEnv in environments ? environments[currentEnv] : environments.development;

module.exports = selectedEnv;