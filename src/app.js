const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('./model')
const {getProfile} = require('./middleware/getProfile')
const {getContractById, getNonTerminatedContracts, getActiveContracts} = require('./crud/contractCrud');
const {getUnpaidJobs, getUnpaidJobById, setJobToPaid, getSumOfUnpaidJobs} = require('./crud/jobCrud');
const {incrementBalance, getProfessionRevenues, getBestPayingClients} = require('./crud/profileCrud');

const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

/**
 * FIX ME!
 * @returns contract by id
 */
app.get('/contracts/:id', getProfile, async (req, res) => {
    const {id} = req.params
    const profileId = req.profile.id
    const contract = await getContractById(id, profileId);
    if (!contract) return res.status(404).end()
    res.json(contract)
});

app.get('/contracts', getProfile, async (req, res) => {
    const profileId = req.profile.id
    const contract = await getNonTerminatedContracts(profileId);
    res.json(contract)
});

app.get('/jobs/unpaid', getProfile, async (req, res) => {
    const profileId = req.profile.id
    const contracts = await getActiveContracts(profileId);
    const contractIds = contracts.map(contract => contract.id);
    const jobs = await getUnpaidJobs(contractIds);
    res.json(jobs)
});

app.post('/jobs/:job_id/pay', getProfile, async (req, res) => {
    const {id: clientId, type: profileType, balance: clientBalance} = req.profile;

    if (profileType !== 'client') {
        return res.status(403).end();
    }

    const jobId = req.params.job_id;
    const job = await getUnpaidJobById(jobId);
    if (!job) return res.status(404).end();

    const jobPrice = job.price;
    console.log('!', {job})
    const contractorId = job.Contract.ContractorId;

    if (jobPrice > clientBalance) {
        return res.status(403).end();
    }

    await incrementBalance(clientId, -jobPrice);
    await incrementBalance(contractorId, jobPrice);

    await setJobToPaid(jobId);

    res.status(201).end()
});

app.post('/balances/deposit/:userId', getProfile, async (req, res) => {
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
});

app.get('/admin/best-profession', getProfile, async (req, res) => {
    const {start, end} = req.query;

    const revenueByProfession = await getProfessionRevenues(parseInt(start), parseInt(end));

    let maxRevenue = 0;
    let bestPayedProfession = null;

    revenueByProfession.filter(data => data.totalAmount).forEach(data => {
        const {totalAmount, profession} = data;

        if (totalAmount > maxRevenue) {
            maxRevenue = totalAmount;
            bestPayedProfession = profession;
        }
    });

    return res.json(bestPayedProfession);
});

app.get('/admin/best-clients', getProfile, async (req, res) => {
    const {start, end, limit} = req.query;
    let bestPayingClients = await getBestPayingClients(parseInt(start), parseInt(end), parseInt(limit) || 2);
    bestPayingClients = bestPayingClients.filter(client => client.paid);
    return res.json(bestPayingClients);
});

module.exports = app;
