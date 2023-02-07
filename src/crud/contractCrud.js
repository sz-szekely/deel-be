const {Contract} = require('../model');
const {Op} = require('sequelize');

async function getContractById(contractId, profileId) {
    return await Contract.findOne({
        where: {
            id: contractId,
            [Op.or]: [{ContractorId: profileId}, {ClientId: profileId}]
        },
        rejectOnEmpty: false
    })
}

async function getNonTerminatedContracts(profileId) {
    return await Contract.findAll({
        where: {
            [Op.or]: [{status: 'new'}, {status: 'in_progress'}],
            [Op.or]: [{ContractorId: profileId}, {ClientId: profileId}]
        }
    })
}

async function getActiveContracts(profileId) {
    return await Contract.findAll({
        where: {
            status: 'in_progress',
            [Op.or]: [{ContractorId: profileId}, {ClientId: profileId}]
        }
    });
}

module.exports = {
    getContractById,
    getNonTerminatedContracts,
    getActiveContracts,
}