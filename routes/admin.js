const express = require('express');
const router = express.Router();
const db = require('../db/connectdb');
const {v4} = require('uuid');
var generator = require('generate-password');
const nodemailer = require("nodemailer");

router.get('/view-user',  (req, res) => {
    db.query('SELECT * FROM users', (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.json(result);
        }
    });
});

router.post('/add-user', (req, res) => {
    const { name, emailid } = req.body;
    const password = generator.generate({
        length: 10,
        numbers: true
    });

    
    db.query(
        'INSERT INTO users (id, name, emailid, password) VALUES (?,?,?,?)',
        [v4(), name, emailid, bcrypt.hashSync(password, 8)],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send('User added');
            }
        }
    );
});

router.post('/create-team', (req, res) => {
    const { teamname, teamcolor, teamtitle,} = req.body;
    db.query('INSERT INTO okr_team (team_id, team_name, tcolor, title) VALUES (?,?,?,?)', [v4(), teamname, teamcolor, teamtitle], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            // res.json({
            //     res
            // });
        }
    });
});

router.get('/view-teams', (req, res) => {
    db.query('SELECT * FROM okr_team', (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.json(result);
        }
    });
});

router.post('/add-objective', (req, res) => {
    const { objective, user_id } = req.body;
    db.query('INSERT INTO okr (objective_id, name, user_id) VALUES (?,?,?)', [v4(), objective, user_id], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.json({
                objectiveid : result.objective_id,
                objective : objective
            });
        }
    });
});

router.delete('/delete-objective/:id', (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM okr WHERE objective_id = ?', id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.status(200).json({message: "Objective deleted"});
        }
    });
});


router.post('/add-keyresult', (req, res) => {
    const { keyname, startdate, enddate, obj_name} = req.body;
    const keyid = v4();
    db.query('INSERT INTO key_attributes (keyid, key_name) VALUES (?,?)', [keyid, keyname], (err, result1) => {
        if (err) {
            console.log(err);
        } else {
            db.query('SELECT objective_id FROM okr WHERE objective_name = ?' [obj_name], (err, result2) => {
                if (err) {
                    console.log(err);
                } else {
                    db.query('INSERT INTO obj_contains (objective_id, keyid, startdate, enddate) VALUES (?,?,?,?)', [result2.objective_id, keyid, startdate, enddate], (err, result3) => {
                        if (err) {
                            console.log(err);
                        } else {
                            res.json(result3);
                        }
                    });
                }
            });
            
        }
    });
});
            



module.exports = router;