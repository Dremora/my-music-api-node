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

exports.facebook = {
  id: process.env.FB_ID,
  secret: process.env.FB_SECRET,
  redirectUrl: process.env.FB_REDIRECT,
  myUserId: process.env.FB_MY_USER_ID
}

exports.cookiesKey = process.env.COOKIES_KEY

exports.port = process.env.PORT || 3000
