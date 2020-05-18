var express = require('express');
var router = express.Router();
var reportController = require('./controller.js');
var checkAuth = require('../middleware/check-auth.js')
var checkRole = require('../middleware/check-role.js')

router.get('/',checkAuth.isLogged, reportController.list);

module.exports = router;
