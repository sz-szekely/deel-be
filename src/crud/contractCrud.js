const {Contract} = require('../model');
const {Op} = require('sequelize');

/**
 * Returns the contract by the provided contractId, in case if the provided profile is involved in the contract.
 * @param contractId
 * @param profileId
 * @return {Promise<Contract>}
 */
async function getContractById(contractId, profileId) {
    return await Contract.findOne({
        where: {
            id: contractId,
            [Op.or]: [{ContractorId: profileId}, {ClientId: profileId}]
        },
        rejectOnEmpty: false
    })
}

/**
 * Returns the terminated contracts of the provided profile.
 * @param profileId
 * @return {Promise<Contract[]>}
 */
async function getNonTerminatedContracts(profileId) {
    return await Contract.findAll({
        where: {
            [Op.or]: [{status: 'new'}, {status: 'in_progress'}],
            [Op.or]: [{ContractorId: profileId}, {ClientId: profileId}]
        }
    })
}

/**
 * Returns the active ('in_progress') contracts of the provided profile.
 * @param profileId
 * @return {Promise<Contract[]>}
 */
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