require('dotenv').config()

const express = require('express');
const favicon = require('serve-favicon');
var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const path = require('path');
const mongoose = require('mongoose');
var cors = require('cors')

// import routers
var userRouter = require('./controllers/user.controller');
var postRouter = require('./controllers/post.controller');
var commentRouter = require('./controllers/comment.controller');


const app = express();
// the __dirname is the current directory from where the script is running
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'build', 'favicon.ico')));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({credentials: true, origin: 'https://chang-zhou-webdevspr2021-a3.herokuapp.com/'}));

// use routers
app.use('/user', userRouter);
app.use('/post', postRouter);
app.use('/comment', commentRouter);
// app.get('/ping', function (req, res) {
//   return res.send('pong');
//  });
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err.stack);
  // res.render('error');
});


// This is the default address for MongoDB.
// Make sure MongoDB is running!
// const mongoEndpoint = 'mongodb+srv://dbUser:123asd456@hacky-news.rksik.mongodb.net/hacky_news_data?retryWrites=true&w=majority';
// useNewUrlParser is not required, but the old parser is deprecated
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

// Get the connection string
const db = mongoose.connection;

// This will create the connection, and throw an error if it doesn't work
db.on('error', console.error.bind(console, 'Error connecting to MongoDB:'));


// start server
const port = process.env.PORT || 8000;
// const port = 8000;
app.listen(port);