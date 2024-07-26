const express = require('express');
const { errors } = require('celebrate');
const routes = require('./routes/index')
const app = express();

app.use(express.json());
app.use(errors());
app.use('/api', routes)

app.get('/', (req, res) => {
  res.send('Hello World');
});


module.exports = app  