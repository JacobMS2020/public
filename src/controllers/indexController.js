require('dotenv').config();
const session = require('express-session');

exports.indexGet = (req, res) => {
    return res.render('index');
}