
require('dotenv').config();
const express = require('express');
const app = express();

const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
.then(() => {
    console.log('DB_CONNECTED.!');
})
.catch(err => {
    console.log(err);
});


const port = process.env.PORT || 6000;
app.listen(port, () => {
    console.log('server running on port 6000...');
});

