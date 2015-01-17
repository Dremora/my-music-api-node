var koa = require('koa')
  , logger = require('koa-logger')
  , bodyParser = require('koa-bodyparser')
  , session = require('koa-session')
  , passport = require('koa-passport')
  , auth = require('./lib/auth')
  , config = require('./lib/config')
  , router = require('./lib/router')

var app = koa()

app.keys = [config.cookiesKey]

app.use(logger())
app.use(bodyParser())
app.use(session())
app.use(passport.initialize())
app.use(passport.session())

app.use(auth.router.middleware())
app.use(router.middleware())

app.listen(config.port)
console.log('Server started on port ' + config.port)
