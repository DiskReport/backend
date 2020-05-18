const compression = require('compression')
const express = require('express');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser')
const logger = require('morgan');
const session = require('express-session')
const redis = require('redis');
var RedisStore = require('connect-redis')(session);
var redisClient = redis.createClient(6379,'redis');

// Log redis errors
redisClient.on('error', (err) => {
  console.log('Redis error: ', err);
});

// App
const app = express();
app.use(compression())

app.use(logger('dev'));

app.use(session({
  store: new RedisStore({ client: redisClient, ttl: 86400 }),
  secret: 'mysecretpheppeelxu',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());
app.use(cookieParser())

app.use('/api/report', require('./report/route.js'));
app.use('/api/host', require('./host/route.js'));
app.use('/api/user', require('./user/route.js'));
app.use('/api/auth', require('./auth/route.js'));

module.exports = app;
