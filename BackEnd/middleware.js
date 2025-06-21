module.exports.IsLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  // console.log("Not Authenticated");
  // alert("Please Login To Continue");
  res.status(401).json({ message: "Unauthorized" });
};
