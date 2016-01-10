var es = require('./database/database').elasticsearch
var _ = require('lodash')

var db = require('./database/albums')
var t = require('tcomb-validation')
var Album = require('./album-types').Album
var errors = require('common-errors')

var toJSON = function (x) { return {
  id: x._id,
  artist: x.artist,
  title: x.title,
  year: x.year,
  comments: x.comments,
  first_played: x.first_played,
  sources: x.sources
}}

exports.all = function *() {
  var data = yield db.view('rest/all')
  return data.map(toJSON)
}

exports.get = function *(id) {
  try {
    var album = yield db.get(id)
    return toJSON(album)
  } catch (e) {
    if (e.error === 'not_found') {
      throw new errors.NotFoundError('Album', e)
    } else {
      throw e
    }
  }
}

var cleanUp = function (obj) {
  if (_.isArray(obj.sources)) {
    _.each(obj.sources, function (source) {
      _.each(source, function (val, key) {
        if (val === null || val === '') {
          delete source[key]
        }
      })
    })
  }
  return obj
}

exports.create = function *(data) {
  var album = {
    artist: data.artist,
    title: data.title,
    year: data.year,
    comments: data.comments,
    first_played: data.first_played,
    sources: data.sources
  }

  cleanUp(album)
  var result = t.validate(album, Album)
  if (!result.isValid()) {
    throw new errors.ValidationError(result.firstError())
  }

  var info = yield db.save(album)
  var data = yield db.get(info.id)
  yield es.create({
    index: 'music',
    type: 'album',
    id: info.id,
    body: data
  })
  return toJSON(data)
}

exports.update = function *(id, data) {
  cleanUp(data)
  var result = t.validate(data, Album)
  if (!result.isValid()) {
    throw new errors.ValidationError(result.firstError())
  }

  var old = yield db.get(id)
  old.artist = data.artist
  old.title = data.title
  old.year = data.year
  old.comments = data.comments
  old.first_played = data.first_played
  old.sources = data.sources

  var info = yield db.save(id, old._rev, old)
  var data = yield db.get(id)
  yield es.delete({
    index: 'music',
    type: 'album',
    id: info.id
  })
  yield es.create({
    index: 'music',
    type: 'album',
    id: info.id,
    body: data
  })
  return toJSON(data)
}

exports.count = function *() {
  return (yield es.count({
    index: 'music',
    type: 'album'
  })).count
}

exports.search = function *(query) {
  var results = yield es.search({
    index: 'music',
    type: 'album',
    body: {
      "from": 0,
      "size": 50,
      "query": {
        "multi_match" : {
          "query" : query,
          "fields" : ["artist", "title", "year"],
          "lenient": true,
          "type": "cross_fields",
          "operator": "and"
        }
      }
    }
  })
  return {
    albums: _.pluck(results.hits.hits, '_source').map(toJSON),
    meta: {
      total: results.hits.total
    }
  }
}
