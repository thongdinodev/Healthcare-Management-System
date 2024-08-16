const Sequelize = require('sequelize')

const sequelize = require('../db/database')

const Billing = sequelize.define('billing', {
    billing_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
    },
    billing_date: {
        type: Sequelize.DATE,
        allowNull: false
    },
    payment_status: {
        type: Sequelize.STRING,
        allowNull: false
    }

}, {
    paranoid: true,
    freezeTableName: true
})

module.exports = Billing