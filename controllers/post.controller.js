const express = require('express');
const authParser = require('../middlewares/auth.middleware');
const PostModel = require('../mongo/post.model');

const router = express.Router();

router.get('/', function(req, res) {
    // return all posts
    PostModel.getAllPosts()
        .then((response) => res.status(200).send(response),
            (error) => res.status(500).send(`Error finding all posts:${error}`));
});

router.get('/:postId', function(req, res) {
    PostModel.getPostByPostId(req.params.postId)
        .then((response) => res.status(200).send(response),
            (error) =>  res.status(500).send(`Error finding post:${error}`));
});

router.post('/', authParser, (req, res) => {
    let post = req.body.post;
    post.username = req.username;
    return PostModel.addPost(post)
        .then((response) => res.status(200).send(response),
            (error) => res.status(500).send(`Error adding post:${error}`));
});

router.put('/', authParser, (req, res) => {
    let post = req.body.post;
    return PostModel.updatePost(post)
        .then((response) => res.status(200).send(response),
            (error) => res.status(500).send(`Error updating post:${error}`));
});

router.delete('/:postId', authParser, (req, res) => {
    return PostModel.deleteByPostById(req.params.postId)
        .then((response) => res.status(200).send(response),
            (error) => {res.status(500).send(`Error deleting post:${error}`)});
});

module.exports = router;