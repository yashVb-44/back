const express = require('express')
const dotenv = require('dotenv')

dotenv.config({ path: './utils/.env' })

const getConfig = () => ({
    mongodbUrl: process.env.MONGODB_URL,
    port: process.env.PORT,
    jwtKey: process.env.JWT_TOKEN
})


module.exports = getConfig