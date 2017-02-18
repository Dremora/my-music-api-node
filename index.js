var koa = require('koa')
  , logger = require('koa-logger')
  , bodyParser = require('koa-bodyparser')
  , passport = require('koa-passport')
  , auth = require('./lib/auth')
  , config = require('./lib/config')
  , errorHandler = require('./lib/error-handler')
  , router = require('./lib/router')

var app = koa()

app.use(logger())
app.use(errorHandler())
app.use(bodyParser())
app.use(passport.initialize())

app.use(auth.router.middleware())
app.use(router.middleware())

app.listen(config.port)
console.log('Server started on port ' + config.port)
