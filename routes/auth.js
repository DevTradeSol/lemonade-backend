var jwt = require('jsonwebtoken');
var express = require('express');
var router = express.Router();
var config = require("../config/general");
var crypto = require("../helper/crypto");
var User = require("../models/user");
var jwthelper = require("../helper/jwt");
var jwtMiddle = require("../middleware/jwt");
var nodemailer = require("nodemailer");
var path = require('path');
var ejs = require("ejs");

router.post('/login', function(req, res) {

    try {
        var email = req.body.email;
        var password = req.body.password;
        User.findOne({'email': email}).then((user) => {
            if(user){
                if(user.isDeleted){
                    return res.json({
                        success: false,
                        msg: 'Your account has been deleted. Please contact Admin!'
                    });
                }
                if(crypto.decrypt(user.password) === password){

                    let token = jwt.sign({
                        sub: user.id,
                        emp: crypto.encrypt(user.id),
                        a: crypto.encrypt(user.name),
                        b: crypto.encrypt(user.email),
                        c: crypto.encrypt(user.role),
                    },
                    config.generalArray.jwtSecret, {
                        algorithm: "HS256",
                        expiresIn: "10h"
                    });

                    let result = {};
                    result.token = token;
                    result.id = user.id;
                    result.name = user.name;
                    result.email = user.email;
                    result.role = user.role;
                    result.fcmToken = user.fcmToken;
                    result.image = user.image;
                    return res.json({
                        success: true,
                        ...result
                    });
                }
                else{
                    return res.json({
                        success: false,
                        msg: 'Incorrect Email or password'
                    });
                }
            }
            else{
                return res.json({
                    success: false,
                    msg: 'Incorrect Email or password'
                });
            }
        });
    } catch (ex) {
        return res.json({
            success: false,
            msg: ex
        });
    }
});

router.post('/loginAsAdmin', function(req, res) {

    try {
        var email = req.body.email;
        var password = req.body.password;
        User.findOne({ 'email': email, role: 'Admin', isDeleted: false }).then((user) => {
            if(user){
                if(crypto.decrypt(user.password) === password){

                    let token = jwt.sign({
                        sub: user.id,
                        emp: crypto.encrypt(user.id),
                        a: crypto.encrypt(user.name),
                        b: crypto.encrypt(user.email),
                        c: crypto.encrypt(user.role),
                    },
                    config.generalArray.jwtSecret, {
                        algorithm: "HS256",
                        expiresIn: "10h"
                    });

                    let result = {};
                    result.token = token;
                    result.id = user.id;
                    result.name = user.name;
                    result.email = user.email;
                    result.role = user.role;
                    result.fcmToken = user.fcmToken;
                    result.image = user.image;
                    return res.json({
                        success: true,
                        ...result
                    });
                }
                else{
                    return res.json({
                        success: false,
                        msg: 'Incorrect Email or password'
                    });
                }
            }
            else{
                return res.json({
                    success: false,
                    msg: 'Incorrect Email or password'
                });
            }
        });
    } catch (ex) {
        return res.json({
            success: false,
            msg: ex
        });
    }
});

router.post('/register', function (req, res) {

    try{
        User.find({email: req.body.email}).then((users) => {
            if(users.length > 0){
                if(users[0].isDeleted){
                    return res.json({
                        success: false,
                        msg: 'Your account has been deleted. Please contact Admin!'
                    });    
                }
                return res.json({
                    success: false,
                    msg: 'User Already Exist!'
                }); 
            }
            else{
                            
                var record = new User({
                    name: req.body.name,
                    email: req.body.email.trim(),
                    password: crypto.encrypt(req.body.password.trim()),
                    fcmToken: req.body.fcmToken,
                    phone: req.body.phone,
                    role: req.body.role
                });

                let token = jwt.sign(
                    {
                        sub: record.id,
                        emp: crypto.encrypt(record.id),
                        a: crypto.encrypt(record.name),
                        b: crypto.encrypt(record.email),
                        c: crypto.encrypt(record.role),
                    },
                    config.generalArray.jwtSecret, {
                        algorithm: "HS256",
                        expiresIn: "10h"
                    }
                );
    
                let result = {};
                result.token = token;
                result.id = record.id;
                result.name = record.name;
                result.email = record.email;
                result.role = record.role;
                result.fcmToken = record.fcmToken;
                // sendEmail('register', record.email, 'Welcome', {name: record.name, otp: record.otp});

                record.save();
                return res.json({
                    success: true,
                    ...result
                });
            }
        });
    }
    catch(ex){
        return res.json({
            success: false,
            msg: ex
        });
    }    
});

router.post('/forgotPassword', function (req, res) {

    try{
        User.findOne({email: req.body.email, isDeleted: false}).then((user) => {

            if (!user) {
                return res.json({
                    success: false,
                    msg: 'User does not Exist'
                });
            }

            user.otp = generateRandom(4);
            user.save();

            sendEmail('forgot_password', req.body.email, 'Forgot Password', {name: user.name, otp: user.otp});

            return res.json({
                success: true,
                msg: 'OTP Sent to your email. Please verify'
            });
        });
    }
    catch(ex){
        return res.json({
            success: false,
            msg: ex
        });
    }    
});

router.post('/resetPassword', function (req, res) {

    try{
        User.findOne({email: req.body.email, isDeleted: false}).then((user) => {
            if (!user) {
                return res.json({
                    success: false,
                    msg: 'User does not Exist'
                });
            }
            user.password = crypto.encrypt(req.body.password.trim());
            user.save();
            return res.json({
                success: true,
                msg: 'Password updated successfully'
            });
        });
    }
    catch(ex){
        return res.json({
            success: false,
            msg: ex
        });
    }    
});

router.post('/verify', function (req, res) {

    try{
        User.findOne({email: req.body.email, isDeleted: false}).then((user) => {
            if (!user) {
                return res.json({
                    success: false,
                    msg: 'User does not Exist'
                });
            }
            else{   
                if(user.otp == req.body.otp){
                    user.isVerified = true;
                    user.save();
                    return res.json({
                        success: true,
                        msg: 'OTP is verified'
                    });
                }
                else{
                    return res.json({
                        success: false,
                        msg: 'OTP is invalid!'
                    }); 
                }
            }
        });
    }
    catch(ex){
        return res.json({
            success: false,
            msg: ex
        });
    }    
});

router.get('/email/:email', function(req, res) {

    try {
        User.findOne({email: req.params.email, isDeleted: false}).then((user) => {
            if (!user) {
                return res.json({
                    success: false,
                    msg: 'User does not Exist'
                });
            }

            let token = jwt.sign({
                sub: user.id,
                emp: crypto.encrypt(user.id),
                a: crypto.encrypt(user.name),
                b: crypto.encrypt(user.email),
                c: crypto.encrypt(user.role),
            },
            config.generalArray.jwtSecret, {
                algorithm: "HS256",
                expiresIn: "10h"
            });

            let result = {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                fcmToken: user.fcmToken,
                token: token,
                image: user.image,
                role: user.role
            };
            return res.json({
                success: true,
                data: result
            });
        });
    } catch (ex) {
        return res.json({
            success: false,
            msg: ex
        });
    }
});

router.get('/profile', jwtMiddle.checkToken, function(req, res) {

    try {
        if (req.headers['authorization']) {
            var userid = crypto.decrypt(req.decoded.emp);
            var name = crypto.decrypt(req.decoded.a);
            var email = crypto.decrypt(req.decoded.b);
            var role = crypto.decrypt(req.decoded.c);
            
            if (userid) {
                let result = {};
                result.id = userid;
                result.name = name;
                result.email = email;
                result.role = role;
                res.json(result);
            } else {
                return res.json({
                    success: false,
                    msg: 'Error'
                });
            }
        }
    } catch (ex) {
        return res.json({
            success: false,
            msg: ex
        });
    }
});

router.post('/sendEmail', function(req, res) {

    if(req.body.name && req.body.to && req.body.subject){
        var transporter = nodemailer.createTransport(config.emailConfigs);

        console.log(config.emailConfigs);

        ejs.renderFile(path.join(__dirname, "../email_templates/register.ejs"), { name: req.body.name }, function (err, data) {
            console.log('err');
            console.log(err);
            if (err) {
                return res.json({
                    success: false,
                    msg: err
                });
            } else {
                var mailOptions = {
                    from: config.emailConfigs.auth.user,
                    to: req.body.to,
                    subject: req.body.subject,
                    html: data
                };
                console.log(mailOptions);
                transporter.sendMail(mailOptions, function (err, info) {
                    // console.log('error', err);
                    // console.log('info', info);
                    if (err) {
                        return res.json({
                            success: false,
                            msg: err
                        });
                    } else {
                        return res.json({
                            success: true,
                            msg: 'Email sent: ' + info.response
                        });
                    }
                });
            }
        });
    }
    else{
        return res.json({
            success: false,
            msg: 'Missing Required Params'
        });
    }
});

var sendEmail = function(template, to, subject, body){

    var transporter = nodemailer.createTransport(config.emailConfigs);

    ejs.renderFile(path.join(__dirname, "../email_templates/"+template+".ejs"), body, function (err, data) {
        if (err) {
            return res.json({
                success: false,
                msg: err
            });
        } else {
            var mailOptions = {
                from: config.emailConfigs.auth.user,
                to: to,
                subject: subject,
                html: data
            };
            // console.log(mailOptions);
            transporter.sendMail(mailOptions);
        }
    });
}

var generateRandom = function (length) {
    return Math.floor(Math.pow(10, length-1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length-1) - 1));
}

module.exports = router;