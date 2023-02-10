// const { v4 } = require("uuid");
const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const db = require("../db/connectdb");

passport.use(
  "user",
  new LocalStrategy(
    {
      usernameField: "emailid",
      passwordField: "password",
      passReqToCallback: true,
    },
    function (req, emailid, password, done) {
      db.query(
        "SELECT * FROM users WHERE emailid = ?",
        [emailid],
        function (err, row) {
          if (err) {
            return done(err);
          }
          if (!row.length) {
            return done(null, false, {
              message: "Incorrect username or password.",
            });
          }
          if (!bcrypt.compareSync(password, row[0].password.toString("utf8"))) {
            return done(null, false, {
              message: "Incorrect username or password.",
            });
          }
          return done(null, row[0]);
        }
      );
    }
  )
);

passport.use(
  "admin",
  new LocalStrategy(
    {
      usernameField: "emailid",
      passwordField: "password",
      passReqToCallback: true,
    },
    function (req, emailid, password, done) {
      db.query(
        "SELECT * FROM admin WHERE emailid = ?",
        [emailid],
        function (err, row) {
          if (err) {
            return done(err);
          }
          if (!row.length) {
            return done(null, false, {
              message: "Incorrect username or password.",
            });
          }
          if (!bcrypt.compareSync(password, row[0].password.toString("utf8"))) {
            return done(null, false, {
              message: "Incorrect username or password.",
            });
          }
          return done(null, row[0]);
        }
      );
    }
  )
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, {
      id: user.id,
      emailid: user.emailid,
      name: user.name,
      role: user.role,
    });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

const router = express.Router();

router.post("/login/admin", passport.authenticate("admin",{
  successReturnToOrRedirect: "/api/admin/dashboard",
  failureRedirect: "/api/auth/login/admin",
}));

router.post("/login", passport.authenticate("user",{
  successReturnToOrRedirect: "/api/user/dashboard",
  failureRedirect: "/api/auth/login",
})
// , (req, res) => {
//   if (req.isAuthenticated()) {
//     res.redirect("/");
//   }
// }
);

router.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    req.session.destroy();
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// router.post("/signup", passport.authenticate("local-signup"), (req, res) => {
//   if (req.isAuthenticated() && req.user.role == "admin") {
//     res.redirect("/admin");
//   }
//   if (req.isAuthenticated() && req.user.role == "user") {
//     res.redirect("/user");
//   }
// });

// passport.use(
//   "local-signup",
//   new LocalStrategy(
//     {
//       usernameField: "emailid",
//       passwordField: "password",
//       passReqToCallback: true,
//     },
//     function (req, emailid, password, done) {
//         db.query(
//           "SELECT * FROM users WHERE emailid = ?",
//           [emailid],
//           function (err, rows) {
//             if (err) return done(err);
//             if (rows.length) {
//               return done(null, false, {
//                 message: "That username is already taken.",
//               });
//             } else {
//               const salt = 8;
//               const newUserMysql = {
//                 id: v4(),
//                 name: req.body.fname + " " + req.body.lname,
//                 emailid: emailid,
//                 role: 'user',
//                 password: bcrypt.hashSync(password, salt),
//               };

//               db.query(
//                 "INSERT INTO users (id,name,emailid,password,role) values (?,?,?,?,?)",
//                 [
//                   newUserMysql.id,
//                   newUserMysql.name,
//                   newUserMysql.emailid,
//                   newUserMysql.password,
//                   newUserMysql.role,
//                 ],
//                 function (err, rows) {
//                   newUserMysql.id = rows.insertId;
//                   return done(null, newUserMysql);
//                 }
//               );
//             }
//           }
//         );
//     }
//   )
// );

module.exports = router;
