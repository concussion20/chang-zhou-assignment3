const express = require('express');
const authParser = require('../middlewares/auth.middleware');
const CommentModel = require('../mongo/comment.model');

const router = express.Router();

router.get('/postid/:postId', function(req, res) {
    CommentModel.getCommentsByPostId(req.params.postId)
        .then((response) => res.status(200).send(response),
            (error) =>  res.status(500).send(`Error finding comments:${error}`));
});

router.get('/commentid/:commentId', function(req, res) {
    CommentModel.getCommentById(req.params.commentId)
        .then((response) => res.status(200).send(response),
            (error) =>  res.status(500).send(`Error finding comments:${error}`));
});

router.post('/', authParser, (req, res) => {
    let comment = req.body.comment;
    comment.username = req.username;
    return CommentModel.addComment(comment)
        .then((response) => res.status(200).send(response),
            (error) => res.status(500).send(`Error adding comment:${error}`))
});

router.put('/', authParser, (req, res) => {
    let comment = req.body.comment;
    return CommentModel.updateComment(comment)
        .then((response) => res.status(200).send(response),
            (error) => res.status(500).send(`Error updating comment:${error}`))
});

router.delete('/:commentId', authParser, (req, res) => {
    return CommentModel.deleteById(req.params.commentId)
        .then((response) => res.status(200).send(response),
            (error) => {res.status(500).send(`Error deleting comment:${error}`)})
});

module.exports = router;