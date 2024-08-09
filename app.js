require('dotenv').config()

const express = require('express')

const sequelize = require('./db/database')
const app = express()

sequelize
    .sync({ alter: true })
    
    .then(() => {
        
        console.log('Table and model synced successfully');
    })
    .catch((err) => {
        console.log(err);
    })

module.exports = app