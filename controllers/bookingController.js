const Booking = require('../models/booking');
const Bus = require('../models/bus');

const bookSeats = async (req, res) => {
    try {
        const { busId, seatNumbers, passengerDetails } = req.body;
        const userId = req.user.id;

        const bus = await Bus.findById(busId);
        if (!bus) {
            return res.status(404).json({ message: "Bus not found" });
        }
        const subtotal = bus.price * seatNumbers.length;
        const gst = subtotal * 0.05;
        const grandTotal = Math.round(subtotal + gst);
        
        for (const seatNum of seatNumbers) {
            const seat = bus.seats.find(s => s.seatNumber === seatNum);
            if (seat && !seat.isBooked) {
                seat.isBooked = true;
                seat.bookedBy = userId;
                seat.bookedAt = new Date();
                // Find passenger details for this seat
                const passengerIndex = seatNumbers.indexOf(seatNum);
                if (passengerIndex !== -1 && passengerDetails[passengerIndex]) {
                    seat.passengerDetails = passengerDetails[passengerIndex];
                }
            }
        }
        
        await bus.save();

        const booking = new Booking({
            userId,
            busId,
            seatNumbers,
            totalPrice: subtotal,
            gst: gst,
            grandTotal: grandTotal,
            passengerDetails,
            status: 'confirmed',
            bookingDate: new Date()
        });

        await booking.save();

        res.status(201).json({
            message: "Seats booked successfully",
            booking: {
                id: booking._id,
                seats: seatNumbers,
                total: grandTotal
            },
            totalPrice: grandTotal
        });

    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({ message: error.message });
    }
};

const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user.id })
            .populate('busId')
            .sort({ bookingDate: -1 });
        
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getBusSeats = async (req, res) => {
    try {
        const { busId } = req.params;
        const bus = await Bus.findById(busId);
        
        if (!bus) {
            return res.status(404).json({ message: "Bus not found" });
        }

        res.json(bus);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        const bus = await Bus.findById(booking.busId);
        for (const seatNum of booking.seatNumbers) {
            const seat = bus.seats.find(s => s.seatNumber === seatNum);
            if (seat) {
                seat.isBooked = false;
                seat.bookedBy = null;
                seat.bookedAt = null;
                seat.passengerDetails = null;
            }
        }
        await bus.save();
        
        booking.status = 'cancelled';
        await booking.save();

        res.json({ message: "Booking cancelled successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    bookSeats,
    getUserBookings,
    getBusSeats,
    cancelBooking
};