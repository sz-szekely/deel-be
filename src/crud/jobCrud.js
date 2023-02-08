const {Job, Contract} = require('../model');
const {Op} = require('sequelize');

/**
 * Returns the list of jobs that have not been paid yet.
 * @param contractIds
 * @return {Promise<Job[]>}
 */
async function getUnpaidJobs(contractIds) {
    return await Job.findAll({
        where: {
            paid: {[Op.not]: true},
            ContractId: {
                [Op.in]: contractIds,
            }
        }
    })
}

/**
 * Returns the requested job, in case if it's unpaid. Otherwise, returns null.
 * @param jobId
 * @return {Promise<Job|null>}
 */
async function getUnpaidJobById(jobId) {
    return await Job.findOne({
        where: {
            id: jobId,
            paid: {[Op.not]: true},
        }, rejectOnEmpty: false,
        include: Contract
    },)
}

/**
 * Sets the specified job as paid.
 * @param jobId
 * @param date
 * @return {Promise<[affectedCount: number, affectedRows: Job[]]>}
 */
async function setJobToPaid(jobId, date = Date.now()) {
    return await Job.update({
        paid: true,
        paymentDate: date,
    }, {
        where: {
            id: jobId,
        }
    });
}

/**
 * Returns the amount still to be paid of the client.
 * @param clientId
 * @return {Promise<number>}
 */
async function getSumOfUnpaidJobs(clientId) {
    return Job.sum('price', {
        include: [{
            model: Contract,
            where: {
                ClientId: clientId
            }
        }
        ]
    })
}

module.exports = {
    getUnpaidJobs,
    getUnpaidJobById,
    setJobToPaid,
    getSumOfUnpaidJobs
}