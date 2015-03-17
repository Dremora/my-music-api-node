var errorHandler = require('./error-handler')
var errors = require('common-errors')

module.exports = function () {
  return function *(next) {
    try {
      yield next;
    } catch (err) {
      console.error(err)
      console.error(err.stack)

      var status_code = err.status;
      if (typeof status_code !== 'number') {
        status_code = errors.HttpStatusError.code_map[err.name];
        if (typeof status_code !== 'number') {
          status_code = udnefined;
        }
      }

      this.status = status_code || 500
      this.body = err.message
    }
  }
}