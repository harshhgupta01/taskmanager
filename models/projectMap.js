const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const ProjectMap = sequelize.define("projectMap", {
  mapId: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  employee_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  project_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = {
  ProjectMap,
};
