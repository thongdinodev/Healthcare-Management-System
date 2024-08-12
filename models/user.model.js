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
        }

    },
    role: {
        type: Sequelize.ENUM('user', 'admin'),
        allowNull: false,
        defaultValue: 'user'
    }
})

User.prototype.validPassword = function(inputPassword) {
    return bcrypt.compareSync(inputPassword, this.password)
}

module.exports = User