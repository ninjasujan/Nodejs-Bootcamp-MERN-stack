
// requiring core module and npm module
require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// importing routes
const authRoutes = require('./routes/auth');

// middleware
app.use(bodyParser.json());

app.use('/api', authRoutes);


mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
.then(() => {
    console.log('DB_CONNECTED.!');
    const port = process.env.PORT || 8000;
    app.listen(port, () => {
        console.log(`server running on port ${port}...`);
    });
})
.catch(err => {
    console.log(err);
});






