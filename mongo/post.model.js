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

function updatePost(newPost, username) {
    return PostModel.findOne({_id: ObjectId(newPost._id)}).exec()
        .then((doc) => {
            if (doc.username !== username) {
                throw new Error("Can't update another person's post!");
            }
            doc.title = newPost.title;
            doc.url = newPost.url;
            doc.content = newPost.content;
            return doc.save();
        });
        // (error) => console.log(`Error updating post:${error}`)
}

function deleteByPostById(postId, username) {
    return PostModel.findOne({_id: ObjectId(postId)}).exec()
        .then((doc) => {
            if (doc.username !== username) {
                throw new Error("Can't delete another person's post!");
            }
            return CommentModel.deleteByPostId(postId)
                .then((response) => PostModel.deleteOne({_id: ObjectId(postId)}),
                (error) => res.status(500).send(`Error adding post:${error}`));
        });
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