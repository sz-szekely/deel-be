const {Job, Contract} = require('../model');
const {Op} = require('sequelize');

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

async function getUnpaidJobById(jobId) {
    return await Job.findOne({
        where: {
            id: jobId,
            paid: {[Op.not]: true},
        }, rejectOnEmpty: false,
        include: Contract
    },)
}

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