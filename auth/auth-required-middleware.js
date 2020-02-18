const Users = require("../users/users-model");
const bcrypt = require("bcryptjs");

module.exports = (req, res, next) => {
  const { username, password } = req.headers;

  if (!(username && password)) {
    res.status(401).json({ message: "Missing credentials." });
  } else {
    Users.findBy({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          next();
        } else {
          res.status(401).json({ message: "You shall not pass!" });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ message: err });
      });
  }
};
