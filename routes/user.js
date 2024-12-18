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
//change
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
            //check blockedList
            console.log("🚀 ~ User.findById ~ req.decoded.c:", crypto.decrypt(req.decoded.c))
            if(crypto.decrypt(req.decoded.c) != "Admin" && user.blockedList.includes(req.decoded.sub)){
                return res.json({
                    success: false,
                    msg: 'blocked by user'
                });
            }
            //get reports count if role admin
            if(crypto.decrypt(req.decoded.c) != "Admin"){
                User.countDocuments({reportedList : req.params.id}).then((items) => {
                    console.log("🚀 ~ User.countDocuments ~ items:", items)
                    return res.json({
                        success: true,
                        data: {...user.toObject(),reportsCount : items}
                    });
                })
            }                   // user.reports = items.
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
                return deleteUser(res, userId);
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
                        return deleteUser(res, userId);
                    });
                }
            });
        }
        else{
            return deleteUser(res, userId);
        }
    } catch (ex) {
        return res.json({
            success: false,
            msg: ex
        });
    }
});

router.put('/restore/:id', jwtMiddle.checkToken, function(req, res) {

    try {
        var id = String(req.params.id);
        User.findByIdAndUpdate(id, { isDeleted: false }).then((user) => {
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
router.put('/block/:id', jwtMiddle.checkToken, function(req, res) {

    try {
        var id = String(req.params.id);
        console.log("🚀 ~ User.findByIdAndUpdate ~ decoded:", req.decoded.sub)
        User.findOneAndUpdate({_id:req.decoded.sub,blockedList:{$ne:req.params.id}}, { $addToSet:{blockedList: req.params.id} }, { new : true}).then((user) => {
            if (!user) {
                return res.json({
                    success: false,
                    msg: 'User already blocked'
                });
            }
            return res.json({
                success: true,
                msg:"User blocked successfully"
            });
        });
    } catch (ex) {
        console.log("🚀 ~ router.put ~ ex:", ex)
        return res.json({
            success: false,
            msg: ex
        });
    }
});
router.put('/report/:id', jwtMiddle.checkToken, function(req, res) {

    try {
        var id = String(req.params.id);
        console.log("🚀 ~ User.findByIdAndUpdate ~ decoded:", req.decoded.sub)
        User.findOneAndUpdate({_id:req.decoded.sub,reportedList:{ $not : {$elemMatch:{_id:req.params.id}}}}, { $addToSet:{ reportedList: {_id : req.params.id, reason : req?.body?.reason || ""}} },{new : true }).then((user) => {
            if (!user) {
                return res.json({
                    success: false,
                    msg: 'User already reported'
                });
            }
            return res.json({
                success: true,
                msg: 'User Reported'
            });
        });
    } catch (ex) {
        return res.json({
            success: false,
            msg: ex
        });
    }
});

router.get('/can-chat/:id',jwtMiddle.checkToken , function (req, res) {
    try{
        console.log("🚀 ~ [req.decoded.sub, req.params.id]:", [req.decoded.sub, req.params.id])
        User.countDocuments({
            _id: { $in: [req.decoded.sub, req.params.id] },
            $or: [
              { _id: req.decoded.sub, blockedList: req.params.id },
              { _id: req.params.id, blockedList: req.decoded.sub }
            ]
          }).then((count) => {
            console.log("🚀 ~ count:", count)
            return res.json({
                success: true,
                data: {
                    canChat: count == 0
                }
            });
        });
        // return deleteUser(res, userId);
    } catch (ex) {
        return res.json({
            success: false,
            msg: ex
        });
    }
});
router.get('/delete/:id', function (req, res) {
    try{
        var userId = String(req.params.id);
        return deleteUser(res, userId);
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
    User.findOneAndDelete({_id: userId, isDeleted: false}, { isDeleted: true }).then((user) => {
        if (!user) {
            return res.json({
                success: false,
                msg: 'User does not Exist'
            });
        }
        return res.json({
            success: true,
            msg: 'Account deleted successfully'
        });
    });
}

module.exports = router;
