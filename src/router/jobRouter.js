const express = require('express');
const {getProfile} = require('../middleware/getProfile');
const jobController = require('../controller/jobController');
const router = express.Router();

router.get('/unpaid', getProfile, jobController.getListOfUnpaidJobs);
router.post('/:job_id/pay', getProfile, jobController.postPayJob);

module.exports = router;