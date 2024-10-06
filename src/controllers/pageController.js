require('dotenv').config();
const session = require('express-session');

exports.indexGet = (req, res) => {
    const dateTime = new Date();
    let welcomeMSG;
    if (req.session.active) {
        welcomeMSG = "Welcome back!";
    } else {
        welcomeMSG = "Welcome!";
        req.session.active = true;
    }
    return res.render('index', {welcomeMSG: welcomeMSG, dateTime: dateTime.toString()});
}

exports.gameGet = (req, res) => {
    if (req.session.active) {
        // current user
    } else {
        // new user
        req.session.active = true;
    }
    return res.render('game');
}

exports.testGet = (req, res) => {return res.render('test');}