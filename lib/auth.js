var passport = require('koa-passport')
  , FacebookStrategy = require('passport-facebook').Strategy
  , Router = require('koa-router')
  , config = require('./config')

passport.serializeUser(function(user, done) {
  done(null, { authenticated: true })
})

passport.deserializeUser(function(id, done) {
  done(null, id)
})

passport.use(new FacebookStrategy({
    clientID: config.facebook.id,
    clientSecret: config.facebook.secret,
    callbackURL: config.facebook.redirectUrl
  },
  function(token, tokenSecret, profile, done) {
    if (profile.id === config.facebook.myUserId) {
      done(null, { authenticated: true })
    } else {
      done(null, false)
    }
  }
))

function *authenticated (next) {
  if (this.isAuthenticated()) {
    yield next
  }
}

var router = new Router()

router.get('/session', function *() {
  this.body = {
    is_authenticated: this.isAuthenticated()
  }
  this.status = this.isAuthenticated() ? 200 : 404
})

router.put('/session', function *(next) {
  // Transform data for passport
  this.query = {
    code: this.request.body.code
  }
  var ctx = this
  yield passport.authenticate('facebook', function *(err, user, info) {
    if (err) throw err
    if (user === false) {
      ctx.status = 401
      ctx.body = { is_authenticated: false }
    } else {
      ctx.status = 201
      ctx.body = { is_authenticated: true }
      yield ctx.req.logIn.bind(ctx.req, user)
    }
  }).call(this, next)
})

router.delete('/session', function *(next) {
  if (this.isAuthenticated()) {
    this.status = 200
    this.logout()
  }
})

module.exports = {
  router: router,
  authenticated: authenticated
}
