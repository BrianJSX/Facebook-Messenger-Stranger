const express = require("express");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const path = require("path");
const route = require("./router");
const db = require("./config/db");
const app = express();
const bodyParser = require('body-parser');
require("dotenv").config();

//config express morgan and public folder
app.use(express.static(__dirname + '/public'));
app.use(morgan("combined"));
//config express handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "/resources/views"));
//config bodyParser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//connect mongodb and config router
db.connect();
route(app);

let port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
