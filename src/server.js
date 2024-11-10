require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const path = require('path');
const { swaggerSpec, swaggerUi } = require('./utils/swagger');
// const uploadSeeds = require('./utils/Seeds');

// Allow requests from http://localhost:3000
app.use(cors({
    origin: 'http://localhost:5173',
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
}));

// Connect to the database
mongoose.connect(process.env.DATABASE_URI, {})
    .then(() => {
        console.log('Connected to MongoDB');
        console.log('The code updated');
        // return uploadSeeds.apply();  // Return the promise from apply method
    })
    .then(() => {
        console.log('Seeds applied successfully');
    })
    .catch(err => {
        console.error('Could not connect to MongoDB or apply seeds...', err);
    });

// use json middleware
app.use(express.json());
const staticPath = path.join(__dirname, 'public');
app.use(express.static(staticPath));

// use routers
app.use('/api', require('./routes/usersRoutes'));
app.use('/api', require('./routes/groupRoutes'));
app.use('/api', require('./routes/courseRoutes'));
app.use('/api', require('./routes/sessionRoutes'));
app.use('/api', require('./routes/fileRoutes'));

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
    res.send('hello world!');
});
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Swagger UI available on http://localhost:${PORT}/api-docs`);
});
