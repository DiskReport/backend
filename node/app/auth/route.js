var express = require('express');
var router = express.Router();
var authController = require('./controller.js');
var checkAuth = require('../middleware/check-auth.js')

router.get('/user',checkAuth.isLogged,authController.userParams);
router.post('/login',authController.login);
router.post('/logout',authController.logout);


module.exports = router;

