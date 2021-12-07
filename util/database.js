const Sequelize = require("sequelize");

const sequelize = new Sequelize("taskmanager", "root", "root", {
  dialect: "mysql",
});

module.exports = sequelize;
