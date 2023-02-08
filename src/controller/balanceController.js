const {getSumOfUnpaidJobs} = require('../crud/jobCrud');
const {incrementBalance} = require('../crud/profileCrud');

/**
 * Handles POST request for depositing a maximum amount of 25% of jobs to be paid.
 * @param req
 * @param res
 * @return {Promise<*>}
 */
const deposit = async (req, res) => {
    const {id: clientId, type: profileType} = req.profile;

    if (profileType !== 'client') {
        return res.status(403).end();
    }

    const {userId} = req.params;
    if (parseInt(userId) !== clientId) {
        return res.status(403).end();
    }

    const {amount} = req.body;

    const sumOfUnpaid = await getSumOfUnpaidJobs(clientId);
    const maxAmount = sumOfUnpaid / 4;

    if (amount > maxAmount) {
        return res.status(403).end();
    }

    await incrementBalance(clientId, amount);

    return res.status(201).end();
}

module.exports = {
    deposit,
}