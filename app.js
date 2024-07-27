const express = require('express');
const { errors } = require('celebrate');
const routes = require('./routes/index')
const i18n = require('./i18n/i18n');


const app = express();

app.use(express.json());
app.use((req, res, next) => {
  const language = req.query.lang || 'en';
  i18n.setLocale(language);
  next();
});
app.use(errors());
app.use('/api', routes)


app.get('/', (req, res) => {
  res.send('Hello World');
});


module.exports = app