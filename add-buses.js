const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const Bus = require('./models/bus');
const sampleBuses = [
    {
        name: "Golden Express",
        from: "Chennai",
        to: "Bangalore",
        price: 550,
        totalSeats: 40,
        busNumber: "GE808",
        departureTime: "07:00 AM",
        arrivalTime: "01:00 PM",
        busType: "AC",
        amenities: ["AC", "WiFi", "Water Bottle", "Charging Point", "TV"],
        routeStops: ["Chennai Central", "Vellore", "Krishnagiri", "Hosur", "Bangalore"]
    },
    {
        name: "Royal Travels",
        from: "Mumbai",
        to: "Pune",
        price: 500,
        totalSeats: 45,
        busNumber: "RT101",
        departureTime: "06:00 AM",
        arrivalTime: "10:00 AM",
        busType: "AC",
        amenities: ["AC", "WiFi", "Water Bottle", "Charging Point", "Snacks"],
        routeStops: ["Mumbai Central", "Thane", "Panvel", "Lonavala", "Pune"]
    },
    {
        name: "City Link Express",
        from: "Delhi",
        to: "Jaipur",
        price: 800,
        totalSeats: 50,
        busNumber: "CL202",
        departureTime: "07:00 AM",
        arrivalTime: "01:00 PM",
        busType: "Luxury",
        amenities: ["AC", "TV", "Charging Point", "Snacks", "Water Bottle", "WiFi", "Blanket"],
        routeStops: ["Delhi", "Gurgaon", "Manesar", "Neemrana", "Jaipur"]
    },
    {
        name: "Green Line Travels",
        from: "Bangalore",
        to: "Chennai",
        price: 600,
        totalSeats: 40,
        busNumber: "GL303",
        departureTime: "08:00 PM",
        arrivalTime: "05:00 AM",
        busType: "Sleeper",
        amenities: ["Sleeper", "AC", "Snacks", "Water Bottle", "Charging Point", "Blanket", "Pillow"],
        routeStops: ["Bangalore", "Kolar", "Chittoor", "Vellore", "Chennai"]
    },
    {
        name: "VRL Travels",
        from: "Pune",
        to: "Goa",
        price: 1500,
        totalSeats: 35,
        busNumber: "VRL505",
        departureTime: "10:00 PM",
        arrivalTime: "08:00 AM",
        busType: "Sleeper",
        amenities: ["Sleeper", "AC", "TV", "Snacks", "WiFi", "Water Bottle", "Charging Point", "Blanket", "Pillow"],
        routeStops: ["Pune", "Satara", "Kolhapur", "Belgaum", "Goa"]
    },
    {
        name: "Orange Tours",
        from: "Delhi",
        to: "Agra",
        price: 400,
        totalSeats: 50,
        busNumber: "OT606",
        departureTime: "05:00 AM",
        arrivalTime: "09:00 AM",
        busType: "Non-AC",
        amenities: ["Water Bottle", "Charging Point", "TV"],
        routeStops: ["Delhi", "Noida", "Mathura", "Agra"]
    },
    {
        name: "Blue Diamond",
        from: "Bangalore",
        to: "Hyderabad",
        price: 900,
        totalSeats: 40,
        busNumber: "BD707",
        departureTime: "09:00 PM",
        arrivalTime: "06:00 AM",
        busType: "Sleeper",
        amenities: ["Sleeper", "AC", "WiFi", "Snacks", "TV", "Water Bottle", "Charging Point", "Reading Light"],
        routeStops: ["Bangalore", "Kurnool", "Mahabubnagar", "Hyderabad"]
    },
    {
        name: "Morning Star",
        from: "Mumbai",
        to: "Ahmedabad",
        price: 1100,
        totalSeats: 45,
        busNumber: "MS809",
        departureTime: "08:00 AM",
        arrivalTime: "06:00 PM",
        busType: "AC",
        amenities: ["AC", "WiFi", "Water Bottle", "Charging Point", "TV", "Snacks", "Lunch"],
        routeStops: ["Mumbai", "Vapi", "Surat", "Vadodara", "Ahmedabad"]
    },
    {
        name: "Night Express",
        from: "Chennai",
        to: "Coimbatore",
        price: 750,
        totalSeats: 40,
        busNumber: "NE910",
        departureTime: "09:00 PM",
        arrivalTime: "05:00 AM",
        busType: "Sleeper",
        amenities: ["Sleeper", "AC", "Water Bottle", "Charging Point", "Blanket", "Pillow"],
        routeStops: ["Chennai", "Salem", "Erode", "Coimbatore"]
    },
    {
        name: "Coastal Travels",
        from: "Goa",
        to: "Mumbai",
        price: 1400,
        totalSeats: 40,
        busNumber: "CT011",
        departureTime: "09:00 PM",
        arrivalTime: "07:00 AM",
        busType: "Luxury",
        amenities: ["Luxury Seats", "AC", "WiFi", "TV", "Snacks", "Water Bottle", "Charging Point", "Blanket"],
        routeStops: ["Goa", "Ratnagiri", "Chiplan", "Mumbai"]
    }
];

async function addBuses() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bus_booking');
        console.log("✅ Connected to MongoDB");
        const deleted = await Bus.deleteMany({});
        console.log(`✅ Cleared ${deleted.deletedCount} existing buses`);
        for (const busData of sampleBuses) {
            const bus = new Bus(busData);
            
         
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
            console.log(`✅ Added ${bus.name} with ${seats.length} seats`);
        }
        
        console.log(`\n📋 Total ${sampleBuses.length} buses added successfully!`);
        
   
        const allBuses = await Bus.find();
        console.log("\n🚌 Available Buses:");
        allBuses.forEach(bus => {
            console.log(`   • ${bus.name} (${bus.busType}): ${bus.from} → ${bus.to} - ₹${bus.price}`);
            console.log(`     Seats: ${bus.seats.length} | Amenities: ${bus.amenities.length}\n`);
        });
        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
}

addBuses();