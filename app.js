// Packages
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

//Sequelize
const sequelize = require("./util/database.js");

//Express obj
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello");
});

// Routing
const adminRoutes = require("./controllers/admin");
app.use("/admin", adminRoutes);

//Creating Database and Starting the server
sequelize
  .sync()
  .then((result) => {
    app.listen(3001);
  })
  .catch((err) => {
    console.log(err);
  });
