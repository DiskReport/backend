var pool = require('../helpers/pg.js');
var userModel = require('./model.js');
const bcrypt = require('bcrypt');

exports.list = (req,res) => {
    userModel.list(function(err,data) {
        if(err) {
            console.log("userController listing error "+err);
            res.status(500).json({error: err})
        } else {
            res.status(200).json(data)
        }
    });
}

exports.add = (req,res) => {
    if (typeof(req.body.username) === 'undefined') {
        res.status(400).json({error: "missing username"})
    } else {
        if (typeof(req.body.password) === 'undefined') {
            res.status(400).json({error: "missing password"})
        } else {
            if (typeof(req.body.email) === 'undefined') {
                res.status(400).json({error: "missing email"})
            } else {
                bcrypt.hash(req.body.password,10,function(err,password_hash) {
                    if (err) {
                        res.status(500).json({error: err});
                    } else {
                        userModel.add(req.body.username,password_hash,req.body.email,function (err) {
                            if (err) {
                                console.log("userController add ERROR "+err);
                                res.status(500).json({error: err});
                            } else {
                                res.status(200).json({});
                            }
                        });
                    }
                });
            } 
        } 
    } 
}

exports.exist = (req,res) => {
    if (req.body.email) {
        userModel.get_by_email(req.body.email,function (err,data) {
            if(err) {
                console.log("internal error")
                res.status(500).json({message: "internal error"});
            } else {
                if (data) {
                    res.status(200).json({message: "exist", exist: true});
                } else {
                    res.status(200).json({message: "available", exist: false});
                }
            }
        });
    } else if (req.body.username) {
        userModel.get_by_username(req.body.username,function (err,data) {
            if(err) {
                console.log("internal error")
                res.status(500).json({message: "internal error"});
            } else {
                if (data) {
                    res.status(200).json({message: "exist", exist: true});
                } else {
                    res.status(200).json({message: "available", exist: false});
                }
            }
        });
    } else {
        console.log("not implemented")
        console.log(req.body)
        res.status(500).json({message: "not implemented"});
    }
}
