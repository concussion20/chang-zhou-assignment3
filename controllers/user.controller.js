const express = require('express');
const { v4: uuid } = require('uuid');
const jwt = require('jsonwebtoken');
const authParser = require('../middlewares/auth.middleware');
const UserModel = require('../mongo/user.model');

const router = express.Router();

// router.post('/', (req, res) => {

//     if(!req.body.username || !req.body.password) {
//         return res.status(404).send({message: "Must include username AND password"});
//     }

//     return UserModel.addUser(req.body)
//         .then((success) => res.send(200).send(success),
//             error => res.send(500).send(error));
// });

// router.post('/authenticate', function (req, res) {
//     UserModel.getUseByUserName(req.body.username)
//         .then((user) => {
//             if (user.password === req.body.password) {
//                 res.status(200).send(user);
//             } else {
//                 res.status(404).send('Failed to authenticate user!');
//             }
//         })
// });

// router.post('/', authParser, function(req, res) {
//     console.log(req.username);
//     console.log(req.body);
//     console.log(req.cookies);
//     res.status(200).send('token works!');
// });
  
// // Can you figure out why authenticate is POST now?
// router.post('/authenticate', function (req, res) {
//     const {username, password} = req.body;
//     const payload = {username};
//     // JWT is encrypting our payload (which is whatever data we want
//     // to carry across sessions: in this case, just the username)
//     // into the cookie based on our SECRET
//     const token = jwt.sign(payload, process.env.SUPER_SECRET, {
//         expiresIn: '14d' // optional cookie expiration date
//     });
//     console.log(token);
//     // Here we are setting the cookie on our response obect.  
//     // Note that we are returning the username, but that isn't as necessary anymore
//     // unless we want to reference that on the frontend
//     return res.cookie('token', token, {httpOnly: true, sameSite: true})
//         .status(200).send({username});
// });

router.get('/loggedin', authParser, function(req, res) {
    return res.status(200).send(req.username);
});

// Can you figure out why authenticate is POST now?
router.post('/login', function (req, res) {
    const {username, password} = req.body;
    UserModel.getUserByUserName(username)
        .then((user) => {
            if (user.password !== password) {
                return res.status(400).send("The password does not match");
            } else {
                const payload = {username};
                // JWT is encrypting our payload (which is whatever data we want
                // to carry across sessions: in this case, just the username)
                // into the cookie based on our SECRET
                const token = jwt.sign(payload, process.env.SUPER_SECRET, {
                    expiresIn: '14d' // optional cookie expiration date
                });
                // Here we are setting the cookie on our response obect.  
                // Note that we are returning the username, but that isn't as necessary anymore
                // unless we want to reference that on the frontend
                return res.cookie('token', token, {httpOnly: true, sameSite: true})
                    .status(200).send({username});
            }
        })
        .catch((error) => {
            console.error(`Something went wrong: ${error}`);
            return res.status(400).send(error);
        });
});

router.get('/isusernameused/:username', function(req, res) {
    UserModel.getUserByUserName(req.params.username)
        .then((user) => res.status(200).send({isUsernameUsed: user !== null}),
            error => res.status(500).send(`Error checking username exists:${error}`));
});

router.post('/signup', function (req, res) {
    const {username, password} = req.body;
    UserModel.addUser({username, password})
        .then((success) => {
            const payload = {username};
            const token = jwt.sign(payload, process.env.SUPER_SECRET, {
                expiresIn: '14d' // optional cookie expiration date
            });
            return res.cookie('token', token, {httpOnly: true, sameSite: true})
                .status(200).send({username});
        },
        error => res.status(500).send(error));
});

router.post('/logout', authParser, function (req, res) {
    return res.clearCookie('token', {httpOnly: true, sameSite: true}).sendStatus(200);
});

module.exports = router;