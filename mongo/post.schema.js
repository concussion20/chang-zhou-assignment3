const Schema = require('mongoose').Schema;

module.exports = new Schema({
    username: { type: String, index: true },
    title: String, 
    url: String,
    content: String
}, { collection : 'posts', timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });