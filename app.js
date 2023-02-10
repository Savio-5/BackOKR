const express = require('express');
const app = express();
require('dotenv').config();

const session = require('express-session');
const passport = require('passport');

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/auth', require('./routes/auth'))
app.use('/api/admin', require('./routes/admin'))
app.use('/api/user', require('./routes/user'))

app.get('/', (req, res) => {
    //console.log(req.user);
    res.send('Hello World!');
});


app.listen(process.env.PORT, () => {
        console.log(`Server is listening on port ${process.env.PORT}`);
    }
);