const mongoose = require('mongoose')
const getConfig = require('./config')
const config = getConfig()

const db = mongoose.connect(config.mongodbUrl, {})
    .then(() => console.log("Database connected!"))
    .catch((err) => console.log(err))

module.exports = db