var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var DoctorModel = require("../model/doctor_model");
var sweetalert = require('sweetalert2');
const { check, validationResult } = require('express-validator');
var router = express.Router();

router.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

router.get('/', function(req, res){
    res.render('login.ejs');
});

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/', [
    check('username').notEmpty().withMessage("Bạn phải điền userName"),
    check('password').notEmpty().withMessage("Bạn phải điền mật khẩu")
], async function(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(422).json({ errors: errors.array() });
    }

    var username = request.body.username;
    var password = request.body.password;

    console.log(`Username: ${username}`); // Log the username
    console.log(`Password: ${password}`); // Log the password

    if (username && password) {
        try {
            var user = await DoctorModel.findOne({ userName: username, password: password }); // Note the 'await' keyword here
            console.log(user); // Log the result of the query

            if (!user) {
                return response.send('Incorrect username / password');
            }

            request.session.loggedin = true;
            request.session.username = username;
            response.cookie('username', username,{ maxAge: 60 * 60 * 1000 });

            if (user.email_status == "not_verified") {
                response.send("please verify your email");
            } else {
                // sweetalert.fire('logged In!');
                response.redirect('/home');
                // response.send('log in')
            }
        } catch (err) {
            console.log(err);
            return response.status(500).send();
        }
    } else {
        response.send('please enter user name and password');
        response.end();
    }
});

module.exports = router;