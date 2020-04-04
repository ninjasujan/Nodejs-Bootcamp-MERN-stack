
const express = require('express');
const app = express();

const port = 5000;

app.get('/', (req, res) => res.send('Hello world.!'));

app.get('/signup', (req, res) => {
    res.send('signup page.!');
})

app.listen(port, () => {
    console.log('server running...');
});

