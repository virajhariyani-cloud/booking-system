const Bus = require('../models/bus');

// Update bus location (for admin/driver)
const updateBusLocation = async (req, res) => {
    try {
        const { busId, lat, lng } = req.body;
        
        const bus = await Bus.findById(busId);
        if (!bus) {
            return res.status(404).json({ message: "Bus not found" });
        }

        bus.currentLocation = {
            lat,
            lng,
            lastUpdated: new Date()
        };

        await bus.save();

        res.json({ message: "Location updated", bus });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get bus location
const getBusLocation = async (req, res) => {
    try {
        const { busId } = req.params;
        const bus = await Bus.findById(busId).select('currentLocation name busNumber');
        
        if (!bus) {
            return res.status(404).json({ message: "Bus not found" });
        }

        res.json(bus);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    updateBusLocation,
    getBusLocation
};