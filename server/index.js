const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser')
const cors = require('cors');
const connectToMongo = require('./db');
const app = express();
app.use(cors());
app.use(bodyParser.json());
const authRouter = require('./routes/RouterAuth'); // Ensure this path is correct
const classRoutes = require('./routes/RouterClass');
const UnitRoutes = require('./routes/RouterUnits');
const SessionRouter = require('./routes/RouterSession');
const CommentRouter = require('./routes/RouterComment');
dotenv.config();

const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectToMongo();

// Middleware

app.use(cors({origin: ["http://localhost:3000/"]}));
app.use(express.json());

// Use the router middleware
app.use('/api', authRouter);
app.use('/api', classRoutes);
app.use('/api/units', UnitRoutes);
app.use('/api/sessions', SessionRouter);
app.use('/api', CommentRouter);
// Start the server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
