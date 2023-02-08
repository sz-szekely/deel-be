const express = require('express');
const {getProfile} = require('../middleware/getProfile');
const contractController = require('../controller/contractController');
const router = express.Router();

router.get('/:id', getProfile, contractController.getUserContractById);
router.get('/', getProfile, contractController.getActiveContracts);

module.exports = router;