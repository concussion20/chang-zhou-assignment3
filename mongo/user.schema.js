const Schema = require('mongoose').Schema;

module.exports = new Schema({
    // Mongo will continue to provide an _id for us
    // but setting index to true can change this from a scan to a query
    // when looking up owner
    username: { type: String, index: true },
    password: String,
}, { collection : 'users' });