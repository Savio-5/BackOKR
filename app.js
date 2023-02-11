const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors')

app.use(cors())

const session = require('express-session');
const passport = require('passport');

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
    //cookie: { secure: true }   // this causes cookies to be secure so u can't acess req.user to get data from session
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', require('./routes/auth'))
app.use('/api/admin', require('./routes/admin'))
app.use('/api/user', require('./routes/user'))



app.listen(process.env.PORT, () => {
        console.log(`Server is listening on port ${process.env.PORT}`);
    }
);