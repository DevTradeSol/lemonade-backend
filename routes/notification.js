var express = require('express');
var router = express.Router();
var crypto = require("../helper/crypto");
var jwtMiddle = require("../middleware/jwt");
var Notification = require("../models/notification");

router.get('/', jwtMiddle.checkToken, function (req, res) {
    try{
        var userId = crypto.decrypt(req.decoded.emp);
        Notification.find({userId: userId}).sort({'createdAt': -1}).populate('createdBy').then((notifications) => {
            if (!notifications) {
                return res.json({
                    success: false,
                    msg: 'Notifications does not Exist'
                });
            }
            return res.json({
                success: true,
                data: notifications
            });
        });
    } catch (ex) {
        return res.json({
            success: false,
            msg: ex
        });
    }   
});

router.get('/unreadCount', jwtMiddle.checkToken, function (req, res) {
    try{
        var userId = crypto.decrypt(req.decoded.emp);
        Notification.find({userId: userId, seen: false}).count().then((count) => {
            return res.json({
                success: true,
                data: count
            });
        });
    } catch (ex) {
        return res.json({
            success: false,
            msg: ex
        });
    }   
});

router.get('/:id', jwtMiddle.checkToken, function (req, res) {
    try {
        var id = String(req.params.id);
        Notification.findById(id).then((notification) => {
            if (!notification) {
                return res.json({
                    success: false,
                    msg: 'Notification does not Exist'
                });
            }
            return res.json({
                success: true,
                data: notification
            });
        });
    } catch (ex) {
        return res.json({
            success: false,
            msg: ex
        });
    }
});

router.post('/', jwtMiddle.checkToken, function(req, res) {
    try {
        var notification = new Notification({
            userId: req.body.userId,
            message: req.body.message,
            type: req.body.type,
            recordId: req.body.recordId,
            createdBy: req.body.createdBy
        });
        notification.save();
        return res.json({
            success: true,
            data: notification
        });
    } catch (ex) {
        return res.json({
            success: false,
            msg: ex
        });
    }
});

router.put('/:id', jwtMiddle.checkToken, function(req, res) {

    try {
        var id = String(req.params.id);
        Notification.findById(id).then((notification) => {
            if (!notification) {
                return res.json({
                    success: false,
                    msg: 'Notification does not Exist'
                });
            }
            notification.userId = req.body.userId;
            notification.message = req.body.message;
            notification.createdBy = req.body.createdBy;
            notification.type = req.body.type;
            notification.recordId = req.body.recordId;
            notification.save();
            return res.json({
                success: true,
                data: notification
            });
        });
    } catch (ex) {
        return res.json({
            success: false,
            msg: ex
        });
    }
});

router.put('/seen/:id', jwtMiddle.checkToken, function(req, res) {

    try {
        var id = String(req.params.id);
        Notification.findByIdAndUpdate(id, {seen: true}).then((notification) => {
            if (!notification) {
                return res.json({
                    success: false,
                    msg: 'Notification does not Exist'
                });
            }
            return res.json({
                success: true,
                data: notification
            });
        });
    } catch (ex) {
        return res.json({
            success: false,
            msg: ex
        });
    }
});

router.delete('/:id', jwtMiddle.checkToken, function (req, res) {
    try {
        var id = String(req.params.id);
        Notification.findByIdAndRemove(id).then((notification)  => {
            if (!notification) {
                return res.json({
                    success: false,
                    msg: 'Notification does not Exist'
                });
            }
            return res.json({
                success: true,
                msg: 'Success'
            });
        });
    } catch (ex) {
        return res.json({
            success: false,
            msg: ex
        });
    }
});

module.exports = router;