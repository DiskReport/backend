var pool = require('../helpers/pg.js');
var AuthModel = require('./model.js');
var UserModel = require('../user/model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = (req, res) => {
    console.log('user controller login')
    let email = req.body.email;
    if (email === undefined) {
        res.status(401).json({message: "email required"})
    } else {
        UserModel.get_by_email(email,function (err,user) {
            if(err) {
                console.log('auth error, in email get: ' + err.error);
                res.status(401).json({message: "Auth failed"})
            } else {
                bcrypt.compare(req.body.password, user.password, (error, resp) => {
                    if(error) {
                        return res.status(401).json({message: "Auth failed"})
                    }
                    if (resp) {
                        const token = jwt.sign(
                            {
                                username: user.username,
                                id: user.id,
                                email: user.email,
                                admin: user.admin
                            },
                            process.env.JWT_KEY,
                            {
                                expiresIn: "1y"
                            },
                        );
                        return res.status(200)
                            .json({
                                message: 'Auth successful',
                                token: token
                            });
                    }
                    res.status(401).json({
                        message: "Auth failed"
                    });
                });
            };
        });
    }
}

exports.userParams = (req, res) => {
    res.json({
        user: {
            username: req.userData.username,
            id: req.userData.id,
            admin: req.userData.admin
        }
    });
}

exports.logout = (req, res) => {
    return res.status(200)
        .json({
            message: 'Logout successful'
        });
}
