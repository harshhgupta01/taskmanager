const express = require("express");
const router = express.Router();
const { Admin } = require("../models/admin.js");
const { login } = require("../models/login");
const { Employee } = require("../models/employee");
const { Task } = require("../models/task");
const { Project } = require("../models/project");
const { ProjectMap } = require("../models/projectMap");

Project.hasMany(Task, {
  foreignKey: "project_id",
});
Task.belongsTo(Project, {
  foreignKey: "project_id",
});
Employee.hasMany(Task, {
  foreignKey: "employee_id",
});
Task.belongsTo(Employee, {
  foreignKey: "employee_id",
});
Project.hasMany(ProjectMap, {
  foreignKey: "project_id",
});
ProjectMap.belongsTo(Project, {
  foreignKey: "project_id",
});
Employee.hasMany(ProjectMap, {
  foreignKey: "employee_id",
});
ProjectMap.belongsTo(Employee, {
  foreignKey: "employee_id",
});

// Login

router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  Admin.findOne({
    where: {
      email: email,
    },
  })
    .then((user) => {
      if (!user) {
        res.json({
          error: "User not found",
        });
      } else {
        if (password === user.password) {
          const bearertoken = Math.floor(Math.random() * 10000001);
          login
            .create({
              secretkey: user.id,
              bearertoken: bearertoken,
              category: "admin",
            })
            .then((login) => {
              res.json({
                bearertoken,
              });
            })
            .catch((err) => {
              res.json({
                error: err.message,
              });
              console.log(err);
            });
        } else {
          res.json({
            error: "Invalid Password",
          });
        }
      }
    })
    .catch((error) => {
      res.json({
        error: error.message,
      });
    });
});

router.post("/logout", verifyToken, async (req, res) => {
  const token = req.token;
  login
    .destroy({
      where: {
        bearertoken: token,
      },
    })
    .then((result) => {
      console.log(result);
      res.json({
        message: "successfully logged out",
      });
    })
    .catch((err) => {
      console.log(err);
      res.json(err.message);
    });
});

router.post("/newAdmin", verifyToken, async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  Admin.create({
    email: email,
    password: password,
  })
    .then((result) => {
      console.log(result);
      res.json({
        message: "successfull",
      });
    })
    .catch((err) => {
      res.json(err.message);
      console.log(err);
    });
});

router.get("/allAdmins", verifyToken, async (req, res) => {
  Admin.findAll()
    .then((admin) => {
      res.json(admin);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/addEmployee", verifyToken, (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const phone = req.body.phone;
  Employee.create({
    name,
    email,
    password,
    phone,
  })
    .then((result) => {
      res.json({
        message: "Successfully created",
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        error: err.message,
      });
    });
});

router.get("/viewEmployees", verifyToken, (req, res) => {
  Employee.findAll()
    .then((result) => {
      if (result.length != 0) {
        res.json(result);
      } else {
        res.json({
          message: "No employees found",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({
        error: err.message,
      });
    });
});

router.post("/createProject", verifyToken, (req, res) => {
  const project_name = req.body.project_name;
  const description = req.body.description;
  Project.create({
    project_name,
    description,
  })
    .then((result) => {
      res.json({
        message: "Successfully created",
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        error: err.message,
      });
    });
});

router.post("/assignEmployee", verifyToken, (req, res) => {
  const employee_id = req.body.employee_id;
  const project_id = req.body.project_id;
  Employee.findOne({
    where: {
      employee_id,
    },
  })
    .then((result) => {
      if (result) {
        Project.findOne({
          where: {
            project_id,
          },
        })
          .then((project) => {
            if (project) {
              ProjectMap.findOne({
                where: {
                  project_id,
                  employee_id,
                },
              })
                .then((mapping) => {
                  if (mapping) {
                    res.json({
                      message: "Mapping already exists",
                    });
                  } else {
                    ProjectMap.create({
                      project_id,
                      employee_id,
                    })
                      .then((result) => {
                        res.json(result);
                      })
                      .catch((err) => {
                        res.json({
                          error: err.message,
                        });
                      });
                  }
                })
                .catch((err3) => {
                  console.log(err3);
                  res.json({
                    error: err3.message,
                  });
                });
            } else {
              res.json({
                message: "Project not found",
              });
            }
          })
          .catch((err2) => {
            console.log(err2);
            res.json({
              error: err2.message,
            });
          });
      } else {
        res.json({
          message: "Employee not found",
        });
      }
    })
    .catch((err1) => {
      console.log(err1);
      res.json({
        error: err1.message,
      });
    });
});

router.post("/assignTask", verifyToken, (req, res) => {
  const employee_id = req.body.employee_id;
  const project_id = req.body.project_id;
  const title = req.body.title;
  const description = req.body.description;
  const status = req.body.status;
  Employee.findOne({
    where: {
      employee_id,
    },
  })
    .then((result) => {
      if (result) {
        Project.findOne({
          where: {
            project_id,
          },
        })
          .then((project) => {
            if (project) {
              Task.create({
                project_id,
                employee_id,
                title,
                description,
                status,
              })
                .then((result) => {
                  res.json(result);
                })
                .catch((err) => {
                  res.json({
                    error: err.message,
                  });
                });
            } else {
              res.json({
                message: "Project not found",
              });
            }
          })
          .catch((err2) => {
            console.log(err2);
            res.json({
              error: err2.message,
            });
          });
      } else {
        res.json({
          message: "Employee not found",
        });
      }
    })
    .catch((err1) => {
      console.log(err1);
      res.json({
        error: err1.message,
      });
    });
});

router.get("/viewProjects", verifyToken, (req, res) => {
  Project.findAll()
    .then((result) => {
      if (result.length != 0) {
        res.json(result);
      } else {
        res.json({
          message: "No projects found",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({
        error: err.message,
      });
    });
});

router.get("/viewEmployeeProjects/:employee_id", verifyToken, (req, res) => {
  const employee_id = req.params.employee_id;
  ProjectMap.findAll({
    include: [
      {
        model: Project,
        required: true,
      },
    ],
    where: {
      employee_id,
    },
  })
    .then((result) => {
      if (result.length != 0) {
        res.json(result);
      } else {
        res.json({
          message: "No projects assigned",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({
        error: err.message,
      });
    });
});

router.get("/viewProjectEmployees/:project_id", verifyToken, (req, res) => {
  const project_id = req.params.project_id;
  ProjectMap.findAll({
    include: [
      {
        model: Employee,
        required: true,
      },
    ],
    where: {
      project_id,
    },
  })
    .then((result) => {
      if (result.length != 0) {
        res.json(result);
      } else {
        res.json({
          message: "No employees assigned",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({
        error: err.message,
      });
    });
});

function randomName(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function verifyToken(req, res, next) {
  // Check if bearer is undefined
  const category = req.body.category;
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    const token = req.headers.authorization.split(" ")[1];

    login
      .findOne({
        where: {
          bearertoken: token,
          category: "admin",
        },
      })
      .then((user) => {
        if (!user) {
          res.json({
            error: "invalid token",
          });
        } else {
          req.token = token;
          next();
        }
      })
      .catch((err) => {
        res.json(err.message);
      });
  } else {
    // Forbidden
    res.json({
      error: "Bearer Token is not found",
    });
  }
}

module.exports = router;
