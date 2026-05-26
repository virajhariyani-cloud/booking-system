const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Bus = require('./models/bus');

const sampleBuses = [
    {
        name: "Royal Travels",
        from: "Mumbai",
        to: "Pune",
        price: 500,
        totalSeats: 40,
        busNumber: "RT101",
        departureTime: "06:00 AM",
        arrivalTime: "10:00 AM",
        amenities: ["AC", "WiFi", "Water Bottle"]
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
        amenities: ["AC", "TV", "Charging Point"]
    },
    {
        name: "Green Line Travels",
        from: "Bangalore",
        to: "Chennai",
        price: 600,
        totalSeats: 45,
        busNumber: "GL303",
        departureTime: "08:00 PM",
        arrivalTime: "05:00 AM",
        amenities: ["Sleeper", "AC", "Snacks"]
    },
    {
        name: "Sharma Transport",
        from: "Mumbai",
        to: "Ahmedabad",
        price: 1200,
        totalSeats: 35,
        busNumber: "ST404",
        departureTime: "09:00 PM",
        arrivalTime: "08:00 AM",
        amenities: ["AC", "WiFi", "Charging Point", "Water Bottle"]
    },
    {
        name: "VRL Travels",
        from: "Pune",
        to: "Goa",
        price: 1500,
        totalSeats: 40,
        busNumber: "VRL505",
        departureTime: "10:00 PM",
        arrivalTime: "08:00 AM",
        amenities: ["Sleeper", "AC", "TV", "Snacks"]
    }
];

async function addBuses() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
        
        // Clear existing buses
        await Bus.deleteMany({});
        console.log("Cleared existing buses");
        
        // Add new buses
        await Bus.insertMany(sampleBuses);
        console.log("Sample buses added successfully!");
        
        process.exit();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

addBuses();