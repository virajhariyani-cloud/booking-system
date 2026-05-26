const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
dotenv.config();

console.log('\n🔧 Checking configuration:');
console.log('MONGO_URI:', process.env.MONGO_URI ? '✅' : '❌');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅' : '❌');
console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? '✅' : '❌');

let stripe;
try {
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('STRIPE_SECRET_KEY not found in .env');
    }
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    console.log('✅ Stripe initialized successfully\n');
} catch (error) {
    console.log('⚠️ Stripe initialization failed:', error.message);
    console.log('💡 Payment features will not work\n');
    stripe = null;
}

const connectDB = require('./config/db');
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/buses', require('./routes/busroutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/location', require('./routes/locationRoutes'));


app.post('/api/create-payment-intent', async (req, res) => {
    try {
        const { amount } = req.body;
        if (!stripe) {
            return res.status(400).json({ 
                error: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to .env file' 
            });
        }
        console.log(`Creating payment intent for amount: ₹${amount}`);
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to paise
            currency: 'inr',
            payment_method_types: ['card'],
            metadata: {
                integration: 'bus_booking'
            }
        });
        console.log(`✅ Payment intent created: ${paymentIntent.id}`);
        res.json({ 
            clientSecret: paymentIntent.client_secret,
            amount: amount
        });
    } catch (error) {
        console.error('Payment error:', error.message);
        res.status(500).json({ error: error.message });
    }
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
app.get('/seat-selection.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'seat-selection.html'));
});
app.get('/my-bookings.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'my-bookings.html'));
});
// app.get('/live-tracking.html', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'live-tracking.html'));
// });

// Socket.io
io.on('connection', (socket) => {
    console.log('New client connected');
    
    socket.on('join-bus-tracking', (busId) => {
        socket.join(`bus_${busId}`);
        console.log(`Client joined bus ${busId}`);
    });
    
    socket.on('update-location', (data) => {
        io.to(`bus_${data.busId}`).emit('location-update', {
            lat: data.lat,
            lng: data.lng,
            busId: data.busId,
            timestamp: new Date()
        });
    });
    
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`\n🚌 Server Running On Port ${PORT}`);
    console.log(`📍 Visit: http://localhost:${PORT}\n`);
    
    if (stripe) {
        console.log('💳 Stripe is ready for payments!');
        console.log('   Test card: 4242 4242 4242 4242\n');
    }
});