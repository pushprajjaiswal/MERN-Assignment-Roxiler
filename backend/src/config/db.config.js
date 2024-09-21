const mongoose = require('mongoose');
const { DB_URL } = require('./server.config');

async function connectToDB() {
    try{
        await mongoose.connect(DB_URL);
    } catch (error) {
        console.log('Unable to connect DB server');
        console.log(error);
    }
}

module.exports = connectToDB;