const {getNonTerminatedContracts, getContractById} = require('../crud/contractCrud');

/**
 * Returns contract by id.
 * @param req
 * @param res
 * @return {Promise<void>}
 */
const getUserContractById = async (req, res) => {
    const {id} = req.params
    const profileId = req.profile.id

    const contract = await getContractById(id, profileId);
    if (!contract) {
        return res.status(404).end()
    }

    res.json(contract)
}

/**
 * Returns active contracts.
 * @param req
 * @param res
 * @return {Promise<void>}
 */
const getActiveContracts = async (req, res) => {
    const profileId = req.profile.id

    const contract = await getNonTerminatedContracts(profileId);

    res.json(contract)
}

module.exports = {
    getUserContractById,
    getActiveContracts,
}