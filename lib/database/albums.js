var database = require('./database')
var thunkify = require('thunkify')
var couch = database.couchdb

var db = couch.database('albums')

module.exports = {
  view: thunkify(db.view.bind(db)),
  get: thunkify(db.get.bind(db)),
  save: thunkify(db.save.bind(db))
}