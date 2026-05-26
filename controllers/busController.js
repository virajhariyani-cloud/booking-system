const Bus = require('../models/bus');

/* Add Bus */

const addBus = async (req, res) => {

    try {

        const bus = await Bus.create(req.body);

        res.json(bus);

    } catch (error) {

        res.json({
            error: error.message
        });

    }

};

/* Get All Buses */

const getBuses = async (req, res) => {

    try {

        const buses = await Bus.find();

        res.json(buses);

    } catch (error) {

        res.json({
            error: error.message
        });

    }

};

module.exports = {

    addBus,
    getBuses

};