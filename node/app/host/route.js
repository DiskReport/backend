var express = require('express');
var router = express.Router();
var hostController = require('./controller.js');
var checkAuth = require('../middleware/check-auth.js')
var checkRole = require('../middleware/check-role.js')

router.get('/',checkAuth.isLogged, hostController.list);
router.post('/',hostController.register);
router.get('/non_claimed',checkAuth.isLogged, checkRole.isAdmin, hostController.list_non_claimed);
router.post('/grantuser',hostController.grantuser);


module.exports = router;
