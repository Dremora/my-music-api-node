var passport = require('koa-passport')
  , FacebookStrategy = require('passport-facebook').Strategy
  , Router = require('koa-router')
  , compose = require('koa-compose')
  , jwt = require('jsonwebtoken')
  , koaJwt = require('koa-jwt')
  , config = require('./config')

passport.use(new FacebookStrategy({
    clientID: config.facebook.id,
    clientSecret: config.facebook.secret,
    callbackURL: config.facebook.redirectUrl
  },
  function(accessToken, refreshToken, profile, done) {
    if (profile.id === config.facebook.myUserId) {
      done(null, { id: profile.id })
    } else {
      done(null, false)
    }
  }
))

const authenticated = compose([
  koaJwt({ secret: config.cookiesKey }),
  function * (next) {
    if (this.state.user.id === config.facebook.myUserId) {
      yield next
    }
  }
])

var router = new Router()

router.get('/auth/facebook', passport.authenticate('facebook', { session: false }))

router.get('/auth/facebook/callback', function *(next) {
  const ctx = this
  yield passport.authenticate('facebook', { session: false }, function *(err, user, info) {
    if (err) throw err
    if (user === false) {
      ctx.redirect('http://localhost:3000?uid=_&token=_')
    } else {
      const token = jwt.sign({ id: user.id }, config.cookiesKey);
      ctx.redirect('http://localhost:3000?uid=' + encodeURIComponent(user.id) + '&token=' + token)
    }
  }).call(this, next)
})

router.get('/auth/validate_token', function * (next) {
  try {
    let isAuthenticated = false
    yield authenticated.call(this, function * () {
      isAuthenticated = true
      this.body = {
        success: true,
        data: {}
      }
    })
    if (!isAuthenticated) {
      throw new Error()
    }
  } catch (e) {
    this.body = {
      is_authenticated: false
    }
  }
})

router.delete('/auth/sign_out', authenticated, function * () {
  this.body = {
    success: true
  }
})

module.exports = {
  router: router,
  authenticated: authenticated
}
