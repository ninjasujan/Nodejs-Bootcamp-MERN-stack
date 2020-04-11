// requiring core module and npm module
require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// importing routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');

// middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// handlig routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);

// database connection and server setup
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('DB_CONNECTED.!');
    const port = process.env.PORT || 8000;
    app.listen(port, () => {
      console.log(`server running on port ${port}...`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
