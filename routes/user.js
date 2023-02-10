const express = require('express');
const router = express.Router();
const db = require('../db/connectdb');
const {v4} = require('uuid');
const { userLoggedIn } = require("../middleware/ensureLoggedIn");

router.get('/', userLoggedIn, (req, res) => {
    // db.query('SELECT * FROM okr_objective where ok', (err, result) => {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         res.json(result);
    //     }
    // });
});

router.post

module.exports = router;