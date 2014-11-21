var es = require('./database/database').elasticsearch
var _ = require('lodash')

var db = require('./database/albums')

var toJSON = function (x) { return {
  id: x._id,
  artist: x.artist,
  title: x.title,
  year: x.year,
  first_played: x.first_played,
  sources: x.sources
}}

exports.all = function *() {
  var data = yield db.view('rest/all')
  return data.map(toJSON)
}

exports.get = function *(id) {
  var album = yield db.get(id)
  return toJSON(album)
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
    first_played: data.first_played,
    sources: data.sources
  }
  cleanUp(album)
  var info = yield db.save(album)
  return yield exports.get(info.id)
}

exports.update = function *(id, data) {
  var old = yield db.get(id)
  old.artist = data.artist
  old.title = data.title
  old.year = data.year
  old.first_played = data.first_played
  old.sources = data.sources
  cleanUp(old)

  var info = yield db.save(id, old._rev, old)
  return yield exports.get(id)
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
          "fields" : ["artist_ngram", "title", "year"],
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
  return results
}