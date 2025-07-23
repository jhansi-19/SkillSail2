require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connect = require('./configs/db');
const PORT = 8080;


// Other Route files
const { userRoute, conversationRoute, gigRoute, messageRoute, orderRoute, reviewRoute, authRoute } = require('./routes');


// App
const app = express();

// Middlewares
app.use((req, res, next) => {
    // Define your complete CSP here
    const csp = "default-src 'none'; script-src 'self' 'sha256-NHm6oPJKWoG64nRG8ZJtL7AWiA5+ZLnfDjKbgeZRCnQ='; img-src 'self'; style-src 'self'; font-src 'self';";
    res.setHeader('Content-Security-Policy', csp);
    next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(compression());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:4173', 'https://jhansiskillsail.netlify.app'],
    credentials: true
}));


// Other Routes
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/gigs', gigRoute);
app.use('/api/conversations', conversationRoute);
app.use('/api/orders', orderRoute);
app.use('/api/messages', messageRoute);
app.use('/api/reviews', reviewRoute);

// Routes
app.get('/', (request, response) => {
    response.send('Hello, Topper!');
});



app.listen(PORT, async () => {
    try {
        await connect(); // Connect to your database
        console.log(`Listening at http://localhost:${PORT}`);

       

    }
    catch (error) { // Catch the full error object for better debugging
        console.error(`Server startup error: ${error.message}`, error); // Log the error for diagnosis
    }
})
