const express = require('express');
const router = express.Router();
const Bus = require('../models/bus');

router.get('/', async (req, res) => {
    try {
        const buses = await Bus.find();
        console.log(`Found ${buses.length} buses`);
        res.json(buses);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        let bus = await Bus.findById(req.params.id);
        
        if (!bus) {
            return res.status(404).json({ message: 'Bus not found' });
        }
        
        if (!bus.seats || bus.seats.length === 0) {
            const rows = Math.ceil(bus.totalSeats / 4);
            const seats = [];
            
            for (let row = 1; row <= rows; row++) {
                for (let col = 1; col <= 4; col++) {
                    const seatNumber = `${row}${String.fromCharCode(64 + col)}`;
                    if (seats.length < bus.totalSeats) {
                        let seatType = 'seater';
                        if (bus.busType === 'Sleeper') {
                            seatType = row % 2 === 0 ? 'upper' : 'lower';
                        } else {
                            seatType = col <= 2 ? 'lower' : 'upper';
                        }
                        
                        seats.push({
                            seatNumber: seatNumber,
                            seatType: seatType,
                            row: row,
                            column: col,
                            isBooked: false
                        });
                    }
                }
            }
            
            bus.seats = seats;
            await bus.save();
            console.log(`Initialized ${seats.length} seats for bus ${bus.name}`);
        }
        
        res.json(bus);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});


router.post('/add', async (req, res) => {
    try {
        const bus = new Bus(req.body);
        
        // Initialize seats
        const rows = Math.ceil(bus.totalSeats / 4);
        const seats = [];
        
        for (let row = 1; row <= rows; row++) {
            for (let col = 1; col <= 4; col++) {
                const seatNumber = `${row}${String.fromCharCode(64 + col)}`;
                if (seats.length < bus.totalSeats) {
                    let seatType = 'seater';
                    if (bus.busType === 'Sleeper') {
                        seatType = row % 2 === 0 ? 'upper' : 'lower';
                    } else {
                        seatType = col <= 2 ? 'lower' : 'upper';
                    }
                    
                    seats.push({
                        seatNumber: seatNumber,
                        seatType: seatType,
                        row: row,
                        column: col,
                        isBooked: false
                    });
                }
            }
        }
        
        bus.seats = seats;
        await bus.save();
        
        res.json({ message: "Bus Added Successfully", bus });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;