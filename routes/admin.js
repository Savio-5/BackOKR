const express = require("express");
const router = express.Router();
const db = require("../db/connectdb");
const { v4 } = require("uuid");
const generator = require("generate-password");
const { adminLoggedIn } = require("../middleware/ensureLoggedIn");
const { transport } = require("../mailer");

// Dashboard route

router.get("/dashboard", adminLoggedIn, (req, res) => {
  //okr_team   ----<works_on>----   usersid
  db.query("SELECT * FROM okr_team", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result);
    }
  });
});

router.get("/view-user", adminLoggedIn, (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result);
    }
  });
});

router.post("/add-user", adminLoggedIn, (req, res) => {
  const { name, emailid } = req.body;
  const password = generator.generate({
    length: 10,
    numbers: true,
  });

  db.query(
    "INSERT INTO users (id, name, emailid, password) VALUES (?,?,?,?)",
    [v4(), name, emailid, bcrypt.hashSync(password, 8)],
    (err, result) => {
      if (err) console.log(err);
      if (result) {
        async function sendEmail() {
          try {
            const mailOptions = {
              from: "s3.silveira@gmail.com",
              to: emailid,
              subject: "Email Password",
              text: "",
              html:
                "<p>" +
                emailid +
                "</p><br><p>Your password is " +
                password +
                "</p>",
            };

            const result = await transport.sendMail(mailOptions);

            return result;
          } catch (error) {
            console.log(error);
          }
        }

        sendEmail()
          .then((result) => {
            // console.log("Email has been sent");
            res.status(200).json({
                message: "Email has been sent",
            });
          })
          .catch((error) => {
            console.log(`An ${error} occured`);
            res.json({
                error: error
            });
          });
      }
    }
  );
});

router.post("/create-team", adminLoggedIn, (req, res) => {
  const { teamname, teamcolor, teamtitle } = req.body;
  db.query(
    "INSERT INTO okr_team (team_id, team_name, tcolor, title) VALUES (?,?,?,?)",
    [v4(), teamname, teamcolor, teamtitle],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        // res.json({
        //     res
        // });
      }
    }
  );
});

router.get("/view-teams", adminLoggedIn, (req, res) => {
  db.query("SELECT * FROM okr_team", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result);
    }
  });
});

router.post("/add-objective", adminLoggedIn, (req, res) => {
  const { objective, user_id } = req.body;
  db.query(
    "INSERT INTO okr (objective_id, name, user_id) VALUES (?,?,?)",
    [v4(), objective, user_id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.json({
          objectiveid: result.objective_id,
          objective: objective,
        });
      }
    }
  );
});

router.delete("/delete-objective/:id", adminLoggedIn, (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM okr WHERE objective_id = ?", id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).json({ message: "Objective deleted" });
    }
  });
});

router.post("/add-keyresult", adminLoggedIn, (req, res) => {
  const { keyname, startdate, enddate, obj_name } = req.body;
  const keyid = v4();
  db.query(
    "INSERT INTO key_attributes (keyid, key_name) VALUES (?,?)",
    [keyid, keyname],
    (err, result1) => {
      if (err) {
        console.log(err);
      } else {
        db.query(
          "SELECT objective_id FROM okr WHERE objective_name = ?"[obj_name],
          (err, result2) => {
            if (err) {
              console.log(err);
            } else {
              db.query(
                "INSERT INTO obj_contains (objective_id, keyid, startdate, enddate) VALUES (?,?,?,?)",
                [result2.objective_id, keyid, startdate, enddate],
                (err, result3) => {
                  if (err) {
                    console.log(err);
                  } else {
                    res.json(result3);
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});

/* send reset password link in email */
router.post("/password-reset", (req, res) => {
  const { emailid } = req.body;
  db.query(
    "SELECT * FROM admin WHERE emailid = ?",
    [emailid],
    function (err, result) {
      if (err) throw err;
      //console.log(result[0]);
      if (result) {
        async function sendEmail() {
          try {
            const mailOptions = {
              from: "s3.silveira@gmail.com",
              to: emailid,
              subject: "Reset email",
              text: "Sent from Node.js",
              //const link = `${clientURL}/passwordReset?token=${resetToken}&id=${user._id}`;
              html: `<html>
              <head>
                  <style>
                  </style>
              </head>
              <body>
                  <p>Hi ${result.admin_name},</p>
                  <p>You requested to reset your password.</p>
                  <p> Please, click the link below to reset your password</p>
                  <a href="${clientURL}/update-password/?id=${emailid}&token=${resetToken}">Reset Password</a>
              </body>
          </html>`  //`<p>Click on the link to reset your password</p><br><a href=${clientURL}/update-password/?id=${emailid}&token=${resetToken}><br>Reset Password</a>`,
            };

            const result = await transport.sendMail(mailOptions);
            return result;
          } catch (error) {
            console.log(error);
          }
        }
        sendEmail().then(() => { //removed result in prameter
            console.log("Email has been sent");
            db.query(
              "UPDATE users SET pass_reset_token = ? WHERE emailid = ?",
              [v4(), emailid],
              (err, result) => {
                if (err) res.status(400).json({ message: "Error occured" });
              }
            );
            res.status(200).json({ message: "Email has been sent" }).redirect("/");
        }).catch((error) => {
            res.json({ message: "incorrect emailid" });
        });
        res.redirect("/");
      }
    }
  );
});

/* update password to database */
router.post("/update-password", (req, res) => {
    const { emailid, token } = req.query;
    const { password } = req.body;
    db.query('SELECT * FROM admin WHERE emailid = ?', [emailid], (err, result) => {
        if(err) res.status(400).json({message: "Error occured"});
        else if(result.length == 0) res.status(400).json({message: "Incorect id"});
        if(result){
            db.query('UPDATE admin SET password = ? WHERE pass_reset_token = ?', [bcrypt.hashSync(password, 8), token], (err, result) => {
                if(err) res.status(400).json({message: "Incorrect token"});
                if(result) res.status(200).json({message: "Password updated"});
            });
        }
    });

});

module.exports = router;
