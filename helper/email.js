const config = require('../config/general');
var nodemailer = require("nodemailer");
var path = require('path');
var moment = require('moment');
var ejs = require("ejs");

function sendEmailOrderSuccess(subject, to, name, totalItem, totalQuantity, subTotal, orderNumber, products) {
    // var transporter = nodemailer.createTransport(config.emailConfigs);

    // var currentDate = moment().format('MMMM Do YYYY, h:mm:ss a');
    // ejs.renderFile(path.join(__dirname, "../email_templates/OrderEmailSendToVendor.ejs"), { baseUrl: config.generalArray.baseUrl, name: name, totalItem: totalItem, totalQuantity: totalQuantity, subTotal: subTotal, orderNumber: orderNumber, products: products, currentDate: currentDate}, function (err, data) {
    //     if (err) {
    //         console.log('err in if', err);
    //         // return {
    //         //     success: false,
    //         //     msg: err
    //         // };
    //     } else {
    //         var mailOptions = {
    //             from: config.emailConfigs.auth.user,
    //             to: to,
    //             subject: subject,
    //             html: data
    //         };
    //         // console.log(mailOptions);
    //         transporter.sendMail(mailOptions, function (err, info) {
    //             if (err) {
    //                 console.log('err in if mail', err);
    //                 // return {
    //                 //     success: false,
    //                 //     msg: err
    //                 // };
    //             } else {
    //                 console.log('success');
    //                 // return {
    //                 //     success: true,
    //                 //     msg: 'Email sent: ' + info.response
    //                 // };
    //             }
    //         });
    //     }
    // });
}

exports.sendEmailOrderSuccess = sendEmailOrderSuccess;