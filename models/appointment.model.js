const Sequelize = require('sequelize')

const sequelize = require('../db/database')

const Appointment = sequelize.define('appointment', {
    appointment_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    appointment_date: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    paranoid: true,
    freezeTableName: true
})

module.exports = Appointment