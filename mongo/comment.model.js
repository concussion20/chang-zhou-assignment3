const mongoose = require("mongoose");
// Recall how exports work in Node.js?
const commentSchema = require('./comment.schema');

const ObjectId = mongoose.Types.ObjectId;
const CommentModel = mongoose.model("Comment", commentSchema);

function addComment(comment) {
    return CommentModel.create(comment);
}

function getCommentById(commentId) {
    return CommentModel.findOne({_id: ObjectId(commentId)}).exec();
}

function getCommentsByPostId(postId) {
    return CommentModel.find({post_id: ObjectId(postId)}).sort({created_at: -1}).exec();
}

function updateComment(newComment) {
    return CommentModel.findOne({_id: ObjectId(newComment._id)}).exec()
        .then((doc) => {
            doc.content = newComment.content;
            return doc.save();
        });
}

function deleteById(commentId) {
    return CommentModel.deleteOne({_id: ObjectId(commentId)});
}

function deleteByPostId(postId) {
    return CommentModel.deleteMany({post_id: ObjectId(postId)});
}

// Make sure to export a function after you create it!
module.exports = {
    addComment,
    getCommentById,
    getCommentsByPostId,
    updateComment,
    deleteById,
    deleteByPostId
};