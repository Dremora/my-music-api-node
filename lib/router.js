var Router = require('koa-router')
  , _ = require('lodash')
  , albums = require('./albums')

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
    try {
      this.body = {
        albums: yield albums.all()
      }
    } catch (e) {
      console.error(e)
      this.status = 500
    }
  }
)

router.get('/albums/:id', function *() {
  try {
    var id = this.params.id
    this.body = {
      album: yield albums.get(id)
    }
  } catch (e) {
    console.error(e)
    console.error(e.stack)
    this.status = 404
  }
})

router.post('/albums', function *() {
  var data = this.request.body
  try {
    this.body = {
      album: yield albums.create(data.album)
    }
  } catch (e) {
    console.error(e)
    this.status = 500
  }
})

router.put('/albums/:id', function *(next) {
  var data = this.request.body
  var id = this.params.id

  try {
    this.body = {
      album: yield albums.update(id, data.album)
    }
  } catch (e) {
    console.error(e)
    console.error(e.stack)
    this.status = 500
  }
})

module.exports = router
