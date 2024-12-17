var express = require('express');
var router = express.Router();
var crypto = require("../helper/crypto");
var jwtMiddle = require("../middleware/jwt");
var Favorite = require("../models//favorite");
var mongoose = require('mongoose');

router.get('/', jwtMiddle.checkToken, function (req, res) {
    try{
        var userId = crypto.decrypt(req.decoded.emp);
        Favorite.find({user: userId}).sort({'createdAt': -1}).populate('item itemCreatedBy').lean().then((favorites) => {
            if (!favorites) {
                return res.json({
                    success: false,
                    msg: 'Favorites does not Exist'
                });
            }
            return res.json({
                success: true,
                data: favorites
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
        Favorite.findById(id).then((favorite) => {
            if (!favorite) {
                return res.json({
                    success: false,
                    msg: 'Favorite does not Exist'
                });
            }
            return res.json({
                success: true,
                data: favorite
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
        Favorite.find({user: new mongoose.Types.ObjectId(req.body.user), item: new mongoose.Types.ObjectId(req.body.item)}).then((favorites) => {
            console.log(favorites);
            if (favorites && favorites.length == 0) {
                var favorite = new Favorite({
                    user: req.body.user,
                    item: req.body.item,
                    itemCreatedBy: req.body.itemCreatedBy
                });
                favorite.save();
                return res.json({
                    success: true,
                    msg: 'Offer has been Saved'
                });
            }
            let id = favorites[0]._id.toString();
            Favorite.findByIdAndRemove(id).then((favorite)  => {
                return res.json({
                    success: true,
                    msg: 'Offer has been Unsaved'
                });
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
        Favorite.findById(id).then((favorite) => {
            if (!favorite) {
                return res.json({
                    success: false,
                    msg: 'Favorite does not Exist'
                });
            }
            favorite.user = req.body.user;
            favorite.itemId = req.body.itemId;
            favorite.save();
            return res.json({
                success: true,
                data: favorite
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
        Favorite.findByIdAndRemove(id).then((favorite)  => {
            if (!favorite) {
                return res.json({
                    success: false,
                    msg: 'Favorite does not Exist'
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