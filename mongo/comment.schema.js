const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

module.exports = new Schema({
    username: String,
    post_id: { type: ObjectId, index: true }, 
    content: String
}, { collection : 'comments', timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });