var express = require('express');
var router = express.Router();
var crypto = require("../helper/crypto");
var jwtMiddle = require("../middleware/jwt");
var Category = require("../models/category");

router.get('/', jwtMiddle.checkToken, function (req, res) {
    try{
        var userId = crypto.decrypt(req.decoded.emp);
        Category.find({createdBy: userId}).sort({'createdAt': -1}).then((categorys) => {
            if (!categorys) {
                return res.json({
                    success: false,
                    msg: 'Category does not Exist'
                });
            }
            return res.json({
                success: true,
                data: categorys
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
        Category.findById(id).then((category) => {
            if (!category) {
                return res.json({
                    success: false,
                    msg: 'Category does not Exist'
                });
            }
            return res.json({
                success: true,
                data: category
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
        var category = new Category({
            name: req.body.name,
            createdBy: req.body.createdBy
        });
        category.save();
        return res.json({
            success: true,
            msg: 'Category has been created'
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
        Category.findById(id).then((category) => {
            if (!category) {
                return res.json({
                    success: false,
                    msg: 'Category does not Exist'
                });
            }
            category.name = req.body.name;
            category.save();
            return res.json({
                success: true,
                data: category
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
        Category.findByIdAndRemove(id).then((category)  => {
            if (!category) {
                return res.json({
                    success: false,
                    msg: 'Category does not Exist'
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