const express = require("express");
const router = express.Router();
const User = require("../Models/User.js");
const passport = require("passport");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//Login Register
router.post("/register", upload.single("picture"), async (req, res) => {
  // res.send("Hello");
  const { name, email, username, password } = req.body;
  const picture = req.file;
  console.log(req.body);
  console.log(req.file);
  let newUser = new User({
    name: name,
    email: email,
    username: username,
    pic: {
      url: req.file.path,
      filename: req.file.filename,
    },
  });
  let user = await User.register(newUser, password)
    .then(() => {
      res.json({ success: true });
    })
    .catch((err) => {
      console.log(err);
      res.json({ message: "There is someting Worng with register" });
    });
  // console.log(user);
});

router.post("/login", passport.authenticate("local"), async (req, res) => {
  console.log("inside login");
  res.json({ success: true, data: req.user });
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
    }
  });
  res.json({ message: "logout successfully" });
});

router.get("/userData", (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({ success: true, user: req.user });
  }
  res.status(401).json({ success: false, message: "Not logged in" });
});

module.exports = router;
