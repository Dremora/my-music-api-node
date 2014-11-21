var cradle = require('cradle')
var elasticsearch = require('elasticsearch')
var config = require('../config')
var couchConfig = config.couchdb

var couchdbConnection = new(cradle.Connection)(couchConfig.host, couchConfig.port , {
  secure: couchConfig.secure,
  cache: false,
  auth: { username: couchConfig.username, password: couchConfig.password }
})

var elasticsearchClient = new elasticsearch.Client({
  host: config.elasticsearch.url
})

exports.couchdb = couchdbConnection;
exports.elasticsearch = elasticsearchClient
