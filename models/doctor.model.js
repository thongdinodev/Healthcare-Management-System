const Sequelize = require('sequelize')

const sequelize = require('../db/database')

const Doctor = sequelize.define('doctor', {
    doctor_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    first_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    last_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    schedule: {
        type: Sequelize.STRING
    },
    specialization: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    paranoid: true,
    freezeTableName: true
})

module.exports = Doctor