const sequelize = require('./config/database');
const port = 8000;
const app = require('./app')
require('./redis/worker')

sequelize
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