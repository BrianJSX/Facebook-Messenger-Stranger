const express = require("express");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const path = require("path");
const route = require("./router");
const db = require("./config/db");
const app = express();
require("dotenv").config();

app.use(express.static(__dirname + '/public'));
app.use(morgan("combined"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "/resources/views"));

db.connect();
route(app);

let port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
