const {Profile, sequelize, Contract, Job} = require("../model");
const {Op} = require("sequelize");

async function incrementBalance(id, amount) {
    return await Profile.increment({balance: amount}, {
        where: {
            id,
        }
    },)
}

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