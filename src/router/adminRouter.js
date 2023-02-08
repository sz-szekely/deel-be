const express = require('express');
const adminRouter = require('../controller/adminController');
const router = express.Router();

/**
 * As admins are not tied to a specific profile, I have not added the 'getProfile' middleware.
 * As an improvement, we can have an admin profile, and have a middleware that checks whether the 'admin' endpoints
 * are being accessed by an admin right user, or not.
 */


router.get('/best-profession', adminRouter.getBestProfessions);
router.get('/best-clients', adminRouter.getBestClients);

module.exports = router;