const { Sequelize } = require('sequelize');
const config = require('./config')
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: 'mysql',
  database: config.database,
  username: config.username,
  password: config.password,
  host: config.host,
  port: config.port,
  logging: false,
});

sequelize.sync({
  alter: true,
});

module.exports = sequelize;