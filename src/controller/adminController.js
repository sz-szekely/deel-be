const {getProfessionRevenues, getBestPayingClients} = require('../crud/profileCrud');


/**
 * Returns the profession that earned the most money (sum of jobs paid) for any contactor
 * that worked in the query time range.
 * @param req
 * @param res
 * @return {Promise<*>}
 */
const getBestProfessions = async (req, res) => {
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
}

/**
 * Returns the best clients, based on the total amount paid in the specified period.
 * The list length can be limited by passing a 'list' query parameter. The default limit is 2.
 * @param req
 * @param res
 * @return {Promise<*>}
 */
const getBestClients = async (req, res) => {
    const {start, end, limit} = req.query;

    let bestPayingClients = await getBestPayingClients(parseInt(start), parseInt(end), parseInt(limit) || 2);
    bestPayingClients = bestPayingClients.filter(client => client.paid);

    return res.json(bestPayingClients);
}

module.exports = {
    getBestProfessions,
    getBestClients,
}