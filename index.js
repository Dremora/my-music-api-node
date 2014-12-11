var koa = require('koa')
  , logger = require('koa-logger')
  , bodyParser = require('koa-bodyparser')
  , config = require('./lib/config')
  , router = require('./lib/router')

var app = koa()

app.use(logger())
app.use(bodyParser())

app.use(router.middleware())

app.listen(config.port)
console.log('Server started on port ' + config.port)
