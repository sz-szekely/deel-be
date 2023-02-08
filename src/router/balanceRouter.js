const express = require('express');
const {getProfile} = require('../middleware/getProfile');
const balanceController = require("../controller/balanceController");
const router = express.Router();

router.post('/deposit/:userId', getProfile, balanceController.deposit);

module.exports = router;