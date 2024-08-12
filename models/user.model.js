const Sequelize = require('sequelize')
const bcrypt = require('bcrypt')

const sequelize = require('../db/database')

const User = sequelize.define('user', {
    user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        set(value) {
            const salt = bcrypt.genSaltSync(12)
            const hash = bcrypt.hashSync(value, salt)
            this.setDataValue('password', hash)
        },
        get() {
            return null
        }

    },
    password_confirm: {
        type: Sequelize.STRING,
        set(value) {
            this.setDataValue('password_confirm', undefined)
        }
        
    },
    role: {
        type: Sequelize.ENUM('user', 'admin'),
        allowNull: false,
        defaultValue: 'user'
    }
})

module.exports = User