const inherits = require('util').inherits

exports.ValidationError = ValidationError

inherits( ValidationError, Error )

function ValidationError() {
  Error.call(this)
  Error.captureStackTrace(this, arguments.callee)
  this.message = argsToMessage( arguments )
}

function argsToMessage( args ) {
  var argI = 1
    , message = args[0]

  message = message.replace( /%s/g, function () {
    return JSON.stringify( args[argI++] )
  })

  return message
}
