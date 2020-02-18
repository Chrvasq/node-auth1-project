const router = require("express").Router();
const Users = require("../users/users-model");

// GET users
router.get("/users", (req, res) => {
  Users.find()
    .then(users => res.status(200).json(users))
    .catch(err => {
      console.log(err);
      res.status(500).json({ errorMessage: "Unable to retrieve users." });
    });
});

module.exports = router;
