var Router = require('koa-router')
  , _ = require('lodash')
  , albums = require('./albums')
  , auth = require('./auth')

var router = new Router()

router.get('/albums',
  function *(next) {
    var length = this.request.query.length
    if (length !== undefined) {
      this.body = {
        albums: [],
        meta: {
          total: yield albums.count()
        }
      }
    } else {
      yield next
    }
  },

  function *(next) {
    var query = this.request.query.query
    if (query) {
      this.body = yield albums.search(query)
    } else {
      yield next
    }
  },

  function *() {
    this.body = {
      albums: yield albums.all()
    }
  }
)

router.get('/albums/:id', function *() {
  var id = this.params.id
  this.body = {
    album: yield albums.get(id)
  }
})

router.post('/albums', auth.authenticated, function *() {
  var data = this.request.body
  this.body = {
    album: yield albums.create(data.album)
  }
})

router.put('/albums/:id', auth.authenticated, function *(next) {
  var data = this.request.body
  var id = this.params.id

  this.body = {
    album: yield albums.update(id, data.album)
  }
})

module.exports = router
