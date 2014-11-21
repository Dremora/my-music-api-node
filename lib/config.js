var dotenv = require('dotenv')

dotenv.load()

exports.couchdb = {
  secure: process.env.COUCHDB_PROTOCOL === 'https',
  host: process.env.COUCHDB_HOST,
  port: process.env.COUCHDB_PORT,
  username: process.env.COUCHDB_USERNAME,
  password: process.env.COUCHDB_PASSWORD
}

exports.elasticsearch = {
  url: process.env.ELASTICSEARCH_URL
}