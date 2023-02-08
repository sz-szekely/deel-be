const {getActiveContracts} = require('../crud/contractCrud');
const {getUnpaidJobs, getUnpaidJobById, setJobToPaid} = require('../crud/jobCrud');
const {incrementBalance} = require('../crud/profileCrud');

/**
 * Returns list of unpaid jobs of active contracts.
 * @param req
 * @param res
 * @return {Promise<void>}
 */
const getListOfUnpaidJobs = async (req, res) => {
    const profileId = req.profile.id;

    const contracts = await getActiveContracts(profileId);
    const contractIds = contracts.map(contract => contract.id);
    const jobs = await getUnpaidJobs(contractIds);

    res.json(jobs)
}

/**
 * Handles POST request for paying a job.
 * @param req
 * @param res
 * @return {Promise<*>}
 */
const postPayJob = async (req, res) => {
    const {id: clientId, type: profileType, balance: clientBalance} = req.profile;

    if (profileType !== 'client') {
        return res.status(403).end();
    }

    const jobId = req.params.job_id;
    const job = await getUnpaidJobById(jobId);
    if (!job) {
        return res.status(404).end();
    }

    const jobPrice = job.price;
    const contractorId = job.Contract.ContractorId;

    if (jobPrice > clientBalance) {
        return res.status(403).end();
    }

    await incrementBalance(clientId, -jobPrice);
    await incrementBalance(contractorId, jobPrice);

    await setJobToPaid(jobId);

    res.status(201).end()
}

module.exports = {
    getListOfUnpaidJobs,
    postPayJob,
}