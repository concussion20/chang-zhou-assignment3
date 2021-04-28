const mongoose = require("mongoose");
// Recall how exports work in Node.js?
const PostSchema = require('./post.schema');

const ObjectId = mongoose.Types.ObjectId;
const PostModel = mongoose.model("Post", PostSchema);
const CommentModel = require('./comment.model');


function addPost(post) {
    return PostModel.create(post);
}

function getPostsByUserName(username) {
    return PostModel.findOne({username: username}).exec();
}

function getPostByPostId(postId) {
    return PostModel.findOne({_id: ObjectId(postId)}).exec();
}

function getAllPosts() {
    return PostModel.find().sort({created_at: -1}).exec();
}

function updatePost(newPost) {
    return PostModel.findOne({_id: ObjectId(newPost._id)}).exec()
        .then((doc) => {
            doc.title = newPost.title;
            doc.url = newPost.url;
            doc.content = newPost.content;
            return doc.save();
        });
        // (error) => console.log(`Error updating post:${error}`)
}

function deleteByPostById(postId) {
    CommentModel.deleteByPostId(postId);
    return PostModel.deleteOne({_id: ObjectId(postId)});
}

// Make sure to export a function after you create it!
module.exports = {
    addPost,
    getPostsByUserName,
    getPostByPostId,
    getAllPosts,
    updatePost,
    deleteByPostById
};