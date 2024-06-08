var express = require('express');
var router = express.Router();
var crypto = require("../helper/crypto");
var User = require("../models/user");
var Item = require("../models/item");
var jwtMiddle = require("../middleware/jwt");
const uploadImage = require("../helper/functions").uploadFile;

router.get('/', jwtMiddle.checkToken, function (req, res) {
    try{
        User.find({}).sort({'createdAt': -1}).then((users) => {
            if (!users) {
                return res.json({
                    success: false,
                    msg: 'Users does not Exist'
                });
            }
            return res.json({
                success: true,
                data: users
            });
        });
    } catch (ex) {
        return res.json({
            success: false,
            msg: ex
        });
    }   
});

router.get('/role/:role', jwtMiddle.checkToken, function (req, res) {
    try{
        var role = String(req.params.role);
        User.find({role: role}).sort({'createdAt': -1}).then((users) => {
            if (!users) {
                return res.json({
                    success: false,
                    msg: 'Users does not Exist'
                });
            }
            return res.json({
                success: true,
                data: users
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
        User.findById(id).then((user) => {
            if (!user) {
                return res.json({
                    success: false,
                    msg: 'User does not Exist'
                });
            }
            return res.json({
                success: true,
                data: user
            });
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
        User.findById(id).then((user) => {
            if (!user) {
                return res.json({
                    success: false,
                    msg: 'User does not Exist'
                });
            }
            user.name = req.body.name;
            user.dob = req.body.dob;
            user.gender = req.body.gender;
            user.city = req.body.city;
            user.phone = req.body.phone;
            user.zip = req.body.zip;
            user.image = req.body.image ?? '';
            user.category = req.body.category;
            user.about = req.body.about;
            user.fcmToken = req.body.fcmToken;
            user.save();
            return res.json({
                success: true,
                data: user
            });
        });
    } catch (ex) {
        return res.json({
            success: false,
            msg: ex
        });
    }
});

router.put('/image/:id', jwtMiddle.checkToken, function(req, res) {

    try {
        var id = String(req.params.id);
        User.findById(id).then(async (user) => {
            if (!user) {
                return res.json({
                    success: false,
                    msg: 'User does not Exist'
                });
            }
            const file = req.files[0];
            if(file){
                const url = await uploadImage(file);
                console.log(url);
                user.image = url;
                user.save();
                return res.json({
                    success: true,
                    data: user
                });
            }
            else{
                return res.json({
                    success: false,
                    msg: 'No Image Provided'
                });
            }            
        });
    } catch (ex) {
        console.log(ex);
        return res.json({
            success: false,
            msg: ex
        });
    }
});

router.put('/notification/:id', jwtMiddle.checkToken, function(req, res) {

    try {
        var id = String(req.params.id);
        var param = req.body.param;
        User.findByIdAndUpdate(id, {isNotificationAllowed: param}).then((user) => {
            if (!user) {
                return res.json({
                    success: false,
                    msg: 'User does not Exist'
                });
            }
            return res.json({
                success: true,
                data: user
            });
        });
    } catch (ex) {
        return res.json({
            success: false,
            msg: ex
        });
    }
});

router.put('/fcm/:id', jwtMiddle.checkToken, function(req, res) {

    try {
        var id = String(req.params.id);
        var fcmToken = req.body.fcmToken;
        User.findByIdAndUpdate(id, {fcmToken: fcmToken}).then((user) => {
            if (!user) {
                return res.json({
                    success: false,
                    msg: 'User does not Exist'
                });
            }
            return res.json({
                success: true,
                data: user
            });
        });
    } catch (ex) {
        return res.json({
            success: false,
            msg: ex
        });
    }
});

router.put('/addChild/:id', jwtMiddle.checkToken, function(req, res) {

    try {
        var id = String(req.params.id);
        var obj = req.body;
        User.findByIdAndUpdate(id, { $push: { children: obj } }).then((user) => {
            if (!user) {
                return res.json({
                    success: false,
                    msg: 'User does not Exist'
                });
            }
            return res.json({
                success: true,
                data: user
            });
        });
    } catch (ex) {
        return res.json({
            success: false,
            msg: ex
        });
    }
});

router.put('/addAchievement/:id', jwtMiddle.checkToken, function(req, res) {

    try {
        var id = String(req.params.id);
        var obj = req.body;
        User.findByIdAndUpdate(id, { $push: { achievement: obj } }).then((user) => {
            if (!user) {
                return res.json({
                    success: false,
                    msg: 'User does not Exist'
                });
            }
            return res.json({
                success: true,
                data: user
            });
        });
    } catch (ex) {
        return res.json({
            success: false,
            msg: ex
        });
    }
});

router.put('/changePassword/:id', jwtMiddle.checkToken, function(req, res) {

    try {
        var id = String(req.params.id);
        User.findById(id).then((user) => {
            if (!user) {
                return res.json({
                    success: false,
                    msg: 'User does not Exist'
                });
            }

            if(crypto.decrypt(user.password) != req.body.oldPassword){
                return res.json({
                    success: false,
                    msg: 'Password does not match'
                });    
            }

            user.password = crypto.encrypt(req.body.newPassword.trim());
            user.save();
            return res.json({
                success: true,
                msg: 'Password updated successfully'
            });
        });
    } catch (ex) {
        return res.json({
            success: false,
            msg: ex
        });
    }
});

router.put('/delete/:id/:role', jwtMiddle.checkToken, function(req, res) {

    try {
        var userId = String(req.params.id);
        var role = String(req.params.role);
        var sessionRole = crypto.decrypt(req.decoded.c);
        if(role == 'Provider'){
            Item.find({createdBy: userId}).then((items) => {
                if (items && items.length) {
                    items.forEach((val) => {
                        val.isDeleted = true;
                        val.save();
                    });
                }
                deleteUser(res, userId);
            });
        }
        else if(role == 'Customer'){
            // Item.find({$or: [ {'applicants': {$in: [userId]}}, {'assignedProviderId': userId}]}).select('assignedProviderId applicants status').then((items) => {
            Item.find({'assignedProviderId': userId, 'status': 'Accepted'}).then((items) => {
                if(items && items.length){
                    let msg = 'You have an item in Accepted Status currently, you can\'t delete your account before completing them!';
                    if(sessionRole == 'Admin'){
                        msg = 'This Customer has an item in Accepted Status currently, you can\'t delete his account before he completed that!';
                    }
                    return res.json({
                        success: false,
                        msg: msg
                    }); 
                }
                else{
                    Item.find({'status': 'Offering', $or: [{'applicants': {$in: [userId]}}, {'assignedProviderId': userId}]}).select('applicants').then((offeredItems) => {
                        if(offeredItems && offeredItems.length){
                            offeredItems.forEach((val) => {
                                let index = val.applicants.findIndex((v) => v == userId);
                                val.applicants.splice(index, 1);
                                val.save();
                            });
                        }
                        deleteUser(res, userId);
                    });
                }
            });
        }
        else{
            deleteUser(res, userId);
        }
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
        User.findByIdAndRemove(id).then((user)  => {
            if (!user) {
                return res.json({
                    success: false,
                    msg: 'User does not Exist'
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

function deleteUser(res, userId){
    User.findByIdAndUpdate(userId, { isDeleted: true }).then((user) => {
        if (!user) {
            return res.json({
                success: false,
                msg: 'User does not Exist'
            });
        }
        return res.json({
            success: true,
            data: user
        });
    });
}

module.exports = router;