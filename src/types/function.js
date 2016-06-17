const _ = require('lodash')

const ValidationError = require('../errors').ValidationError

exports.match = ( arg ) => _.isFunction( arg )
exports.merge = ( old, a ) => a
exports.validate = function( value ) {
  if ( !_.isFunction( value ) )
    throw new ValidationError( 'Expected key %s to be function, got %s instead.', this.key, value )
}
