var express = require('express');
var router = express.Router();
var userController = require('./controller.js');
var checkAuth = require('../middleware/check-auth.js')
var checkRole = require('../middleware/check-role.js')

router.get('/', checkAuth.isLogged, checkRole.isAdmin, userController.list);
router.post('/', userController.add);
router.post('/exist', userController.exist);


module.exports = router;

