const Users = require("../users/users-model");
const bcrypt = require("bcryptjs");

module.exports = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.status(400).json({ message: "You shall not pass!" });
  }
};
