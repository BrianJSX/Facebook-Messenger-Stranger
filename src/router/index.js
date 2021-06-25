const webhook = require("./webhooks");

function route(app){
    app.use("/", webhook);
}

module.exports = route;