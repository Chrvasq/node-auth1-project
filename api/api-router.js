const router = require("express").Router();
const bcrypt = require("bcryptjs");
const Users = require("../users/users-model");
const authorize = require("../auth/auth-required-middleware");
const authRouter = require("../auth/auth-router");

router.use("/restricted", authorize, authRouter);

router.get("/", (req, res) => {
  res.json({ api: "It's alive!" });
});

// POST register new user
router.post("/register", (req, res) => {
  const user = req.body;
  const hash = bcrypt.hashSync(user.password, 14);
  user.password = hash;

  Users.add(user)
    .then(saved => res.status(201).json(saved))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
