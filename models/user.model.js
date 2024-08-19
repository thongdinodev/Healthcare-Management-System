const Sequelize = require('sequelize')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

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
        allowNull: false,
        unique: true
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
    },
    passwordResetToken: {
        type: Sequelize.STRING
    },
    passwordResetExpires: {
        type: Sequelize.DATE
    }
}, {
    paranoid: true,
    freezeTableName: true
})

User.prototype.validPassword = function(inputPassword) {
    return bcrypt.compareSync(inputPassword, this.password)
}

User.prototype.createResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    console.log({resetToken}, this.passwordResetToken);
    // log reset token when user forgot password

    this.passwordResetExpires = Date.now() + 30 * 60 * 1000;

    return resetToken;
}

module.exports = User