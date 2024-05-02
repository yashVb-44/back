const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path')
const rootRoutes = require('./routes/rootRoutes');
const getConfig = require('./utils/config');
const db = require('./utils/db');

const app = express();
const config = getConfig()

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api', rootRoutes);
app.use("/uploads", express.static("uploads"));

// Start the server
const PORT = config.port || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
