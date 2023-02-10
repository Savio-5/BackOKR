const userLoggedIn = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role == "user") {
    next();
  } else {
    res.redirect("/login");
  }
}

const adminLoggedIn = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role == "admin") {
    next();
  } else {
    res.redirect("/login/admin");
  }
}

module.exports = { userLoggedIn, adminLoggedIn };