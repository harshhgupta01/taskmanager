const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Employee = sequelize.define("employee", {
  employee_id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      isEmail: true,
    },
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      is: /^(\+91[\-\s]?)?[0]?(91)?[56789]\d{9}$/,
    },
  },
});

module.exports = {
  Employee,
};
