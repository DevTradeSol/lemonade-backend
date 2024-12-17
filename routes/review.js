var express = require('express');
var router = express.Router();
var crypto = require("../helper/crypto");
var jwtMiddle = require("../middleware/jwt");
var Review = require("../models/review");

router.get('/:role', jwtMiddle.checkToken, function (req, res) {
    try{
        var userId = crypto.decrypt(req.decoded.emp);
        var role = String(req.params.role);
        let query = {};
        if(role == 'Provider'){
            query.createdBy = userId;
        }
        else if(role == 'Customer'){
            query.user = userId;
        }
        Review.find(query).sort({'createdAt': -1}).populate('item user createdBy').lean().then((reviews) => {
            if (!reviews) {
                return res.json({
                    success: false,
                    msg: 'Reviews does not Exist'
                });
            }
            return res.json({
                success: true,
                data: reviews
            });
        });
    } catch (ex) {
        return res.json({
            success: false,
            msg: ex
        });
    }   
});

router.get('/item/:id', jwtMiddle.checkToken, function (req, res) {
    try {
        Review.find({item: req.params.id}).sort({'createdAt': -1}).populate('user createdBy').lean().then((reviews) => {
            if (!reviews) {
                return res.json({
                    success: false,
                    msg: 'Reviews does not Exist'
                });
            }
            return res.json({
                success: true,
                data: reviews
            });
        });
    } catch (ex) {
        return res.json({
            success: false,
            msg: ex
        });
    }
});

router.get('/customer/:id', jwtMiddle.checkToken, function (req, res) {
    try {
        Review.find({user: req.params.id}).sort({'createdAt': -1}).populate('user item createdBy').lean().then((reviews) => {
            if (!reviews) {
                return res.json({
                    success: false,
                    msg: 'Reviews does not Exist'
                });
            }
            return res.json({
                success: true,
                data: reviews
            });
        });
    } catch (ex) {
        return res.json({
            success: false,
            msg: ex
        });
    }
});

router.get('/detail/:id', jwtMiddle.checkToken, function (req, res) {
    try {
        var id = String(req.params.id);
        Review.findById(id).populate('user item createdBy').lean().then((review) => {
            if (!review) {
                return res.json({
                    success: false,
                    msg: 'Review does not Exist'
                });
            }
            return res.json({
                success: true,
                data: review
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
        Review.find({user: req.body.user, item: req.body.item, createdBy: req.body.createdBy}).then((reviews) => {
            if(reviews.length > 0){
                return res.json({
                    success: false,
                    msg: 'Your Review of this item is Already Exist!'
                }); 
            }
            else{
                var review = new Review({
                    user: req.body.user,
                    item: req.body.item,
                    comment: req.body.comment,
                    rating: req.body.rating,
                    createdBy: req.body.createdBy
                });
                review.save();
                return res.json({
                    success: true,
                    data: review
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

router.put('/:id', jwtMiddle.checkToken, function(req, res) {

    try {
        var id = String(req.params.id);
        Review.findById(id).then((review) => {
            if (!review) {
                return res.json({
                    success: false,
                    msg: 'Review does not Exist'
                });
            }
            review.comment = req.body.comment;
            review.rating = req.body.rating;
            review.save();
            return res.json({
                success: true,
                data: review
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
        Review.findByIdAndRemove(id).then((review)  => {
            if (!review) {
                return res.json({
                    success: false,
                    msg: 'Review does not Exist'
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