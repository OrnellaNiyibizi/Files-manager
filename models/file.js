const db = require('../config/database')
const { Model, DataTypes } = require('sequelize');
const User = require('./user')

class File extends Model {}

File.init(
  {
    filename: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    filepath: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id',
        },
    },
    originalName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    size: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    mimeType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
  },
  {
    modelName: 'File',
    sequelize: db,
  }
);

File.belongsTo(User, { as: 'user', foreignKey: 'userId' });
User.hasMany(File, { as: 'files', foreignKey: 'userId' });

module.exports = File;