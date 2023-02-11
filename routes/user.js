const express = require('express');
const router = express.Router();
const db = require('../db/connectdb');
const {v4} = require('uuid');
const { userLoggedIn } = require("../middleware/ensureLoggedIn");

router.get('/dashboard', userLoggedIn, (req, res) => {
    //okr_team   ----<works_on>----   users
    db.query('SELECT * FROM okr_team where team_id = (Select * from works_on where user_id= ? )',[req.user.id], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.json(result);
        }
    });
});

router.get('/update-key', userLoggedIn, (req, res) => {
    //okr_team   ----<works_on>----   users
    db.query('SELECT * FROM okr_team where ', (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.json(result);
        }
    });
});


module.exports = router;