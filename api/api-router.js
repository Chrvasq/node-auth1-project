const router = require("express").Router();
const bcrypt = require("bcryptjs");
const Users = require("../users/users-model");
const authorize = require("../auth/auth-required-middleware");
const authRouter = require("../auth/auth-router");

router.use("/restricted", authorize, authRouter);

router.get("/", (req, res) => {
  res.json({ api: "It's alive!" });
});

// Register new user
router.post("/register", (req, res) => {
  const user = req.body;
  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;

  Users.add(user)
    .then(saved => res.status(201).json(saved))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Login user
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.userId = user.id;
        res.status(200).json({ message: `Welcome ${user.username}.` });
      } else {
        res.status(401).json({ message: "Invalid credentials." });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ errorMessage: err });
    });
});

// Logout user
router.delete("/logout", (req, res) => {
  if (req.session.userId) {
    req.session.destroy(err => {
      // check if err exists
      err
        ? res.status(400).send("Can't logout")
        : res.send("You've successfully logged out.");
    });
  } else {
    res.end();
  }
});

module.exports = router;
