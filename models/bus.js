const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
    seatNumber: String,
    seatType: {
        type: String,
        enum: ['lower', 'upper', 'sleeper', 'seater'],
        default: 'seater'
    },
    row: Number,
    column: Number,
    isBooked: {
        type: Boolean,
        default: false
    },
    bookedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    bookedAt: Date,
    passengerDetails: {
        name: String,
        age: Number,
        gender: {
            type: String,
            enum: ['male', 'female', 'child']
        },
        contactNumber: String
    }
});

const busSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    totalSeats: {
        type: Number,
        required: true
    },
    seats: [seatSchema],
    departureTime: {
        type: String,
        required: true
    },
    arrivalTime: {
        type: String,
        required: true
    },
    busNumber: {
        type: String,
        required: true,
        unique: true
    },
    busType: {
        type: String,
        enum: ['AC', 'Non-AC', 'Sleeper', 'Luxury'],
        default: 'AC'
    },
    currentLocation: {
        lat: Number,
        lng: Number,
        lastUpdated: Date
    },
    amenities: [String],
    routeStops: [String]
});

busSchema.pre('save', function(next) {
    if (this.seats.length === 0 && this.totalSeats) {
        const rows = Math.ceil(this.totalSeats / 4);
        let seatCounter = 1;
        
        for (let row = 1; row <= rows; row++) {
            for (let col = 1; col <= 4; col++) {
                if (seatCounter <= this.totalSeats) {
                    let seatType = 'seater';
                    if (this.busType === 'Sleeper') {
                        seatType = row % 2 === 0 ? 'upper' : 'lower';
                    }
                    
                    this.seats.push({
                        seatNumber: `${row}${String.fromCharCode(64 + col)}`,
                        seatType: seatType,
                        row: row,
                        column: col,
                        isBooked: false
                    });
                    seatCounter++;
                }
            }
        }
    }
    next();
});

module.exports = mongoose.model('Bus', busSchema);