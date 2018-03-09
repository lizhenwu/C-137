const mongoose = require('mongoose');
const config = require('../config');
mongoose.Promise = global.Promise;

// 返回的是promise
mongoose.connect(`mongodb://localhost/${config.db}`, {
    user: config.db_account,
    pass: config.db_password
}, err => {
    if(err) {
        console.log('failed to connect db!')
        process.exit(0);
    } else {
        console.log('db connected!')
    }
});