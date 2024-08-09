const Sequelize = require('sequelize')

const sequelize = require('../db/database')

const Patient = sequelize.define('patient', {
    patient_id: {
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
    date_of_birth: {
        type: Sequelize.DATE,
        allowNull: false
    },
    phone_number: {
        type: Sequelize.STRING,
        allowNull: false
    },
    gender: {
        type: Sequelize.STRING,
        allowNull: false
    },
    address: {
        type: Sequelize.STRING
    },
    insurance_info: {
        type: Sequelize.STRING
    }
})

module.exports = Patient