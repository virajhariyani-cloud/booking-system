const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    busId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bus',
        required: true
    },
    seatNumbers: [String],
    totalPrice: {
        type: Number,
        required: true
    },
    gst: {
        type: Number,
        default: 0
    },
    grandTotal: {
        type: Number,
        required: true
    },
    bookingDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['confirmed', 'cancelled', 'pending'],
        default: 'confirmed'
    },
    passengerDetails: [{
        name: String,
        age: Number,
        gender: {
            type: String,
            enum: ['male', 'female', 'child']
        },
        contactNumber: String
    }]
});

module.exports = mongoose.model('Booking', bookingSchema);