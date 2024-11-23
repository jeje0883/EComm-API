const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require('passport');
const session = require('express-session');
require('dotenv').config();
const cron = require('node-cron');
const axios = require('axios'); // Added Axios import

//server ping toggler
const alwaysAwake = false; //

// Define env config
const port = process.env.PORT || 3000;
const mongodb = process.env.MONGODB_STRING;
const secret = process.env.clientSecret;
const serverUrl = process.env.SERVER_URL || `http://localhost:${port}`;

// Setup middleware
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'http://zuitt-bootcamp-prod-460-7841-descalsota.s3-website.us-east-1.amazonaws.com',
        'https://e-comm-client-delta.vercel.app'
    ],
    credentials: true,
    optionsSuccessStatus: 200
};

// Connect to MongoDB
mongoose.connect(mongodb, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas'));

// Setup the server
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Define routes
const cartRoutes = require("./routes/cartRoute");
const orderRoutes = require("./routes/orderRoute");
const productRoutes = require("./routes/productRoute");
const userRoutes = require("./routes/userRoute");
const publicRoutes = require("./routes/publicRoute"); // Public routes

// Setup routes
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);
app.use("/products", productRoutes);
app.use("/users", userRoutes);
app.use("/", publicRoutes); // Use public routes

// Schedule tasks to be run on the server every 14 minutes using Axios
if (alwaysAwake) {
    cron.schedule('*/14 * * * *', async function () {
        try {
            const response = await axios.get(`${serverUrl}/ping`);
            console.log(`[${new Date().toISOString()}] Pinged the server successfully:`, response.status);
        } catch (error) {
            console.error(`[${new Date().toISOString()}] Error pinging server: ${error.message}`);
        }
    });
    console.log('Cron job to keep the server awake has been started.');
}

app.get('/', (req, res) => {
    res.status(200).send('Welcome to the Flight Management API');
});

// Initialize the server
// if (require.main === module) {
//     app.listen(port, () => {
//         console.log(`API is now online on port ${port}`);
//     });
// }

module.exports = { app, mongoose };
