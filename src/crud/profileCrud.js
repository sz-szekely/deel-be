const {Profile, sequelize, Contract, Job} = require("../model");
const {Op} = require("sequelize");

/**
 * Increment balance of user with the provided amount.
 * If the provided amount is negative, the balance will be decremented.
 * @param id
 * @param amount
 * @return {Promise<[affectedRows: Profile[], affectedCount: number]>}
 */
async function incrementBalance(id, amount) {
    return await Profile.increment({balance: amount}, {
        where: {
            id,
        }
    },)
}

/**
 * Returns the professions and their total received payments.
 * In case the contractors of a profession have not been paid yet, the associated totalAmount will be null.
 * @param start
 * @param end
 * @return {Promise<{profession: string, totalAmount: number | null}[]>}
 */
async function getProfessionRevenues(start, end) {
    return await Profile.findAll({
        attributes: [
            'profession',
            [sequelize.fn('sum', sequelize.col('Contractor.Jobs.price')), 'totalAmount']
        ],
        group: 'profession',
        raw: true,
        where: {
            type: 'contractor'
        },
        include: [{
            model: Contract,
            as: 'Contractor',
            attributes: [],

            include: [{
                model: Job,
                attributes: [],
                where: {
                    paid: true,
                    paymentDate: {
                        [Op.gte]: start,
                        [Op.lte]: end,
                    }
                }
            }]
        }]
    });
}

/**
 * Returns the reversed order list of clients, based on the amount they have already paid to contractors.
 * The list will contain the first 'limit' number of clients.
 * @param start
 * @param end
 * @param limit
 * @return {Promise<{id: string, fullName: string, paid: number}[]>}
 */
async function getBestPayingClients(start, end, limit) {
    return await Profile.findAll({
        attributes: [
            'id',
            [sequelize.literal(`firstName || ' ' || lastName`), 'fullName'],
            [sequelize.fn('sum', sequelize.col('Client.Jobs.price')), 'paid']
        ],
        group: 'Profile.id',
        raw: true,
        where: {
            type: 'client',
        },
        include: [{
            model: Contract,
            as: 'Client',
            attributes: [],

            include: [{
                model: Job,
                attributes: [],
                where: {
                    paid: true,
                    paymentDate: {
                        [Op.gte]: start,
                        [Op.lte]: end,
                    }
                }
            }]
        }],
        order: [['paid', 'DESC']],
        limit,
        subQuery: false
    });
}


module.exports = {
    incrementBalance,
    getProfessionRevenues,
    getBestPayingClients,
}