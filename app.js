const express = require('express');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const db = require('./models/index');

const app = express();
const port = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(errors());

app.get('/', (req, res) => {
  res.send('Hello World');
});

db.sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
