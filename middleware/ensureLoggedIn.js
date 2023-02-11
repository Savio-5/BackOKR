const userLoggedIn = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role == "user") {
    next();
  } else {
    res.json({ redirect: "/login" })
  }
}

const adminLoggedIn = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role == "admin") {
    next();
  } else {
    res.json({ redirect: "/login/admin" })
  }
}

export default { userLoggedIn, adminLoggedIn };