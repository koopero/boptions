const _ = require('lodash')
const ValidationError = require('../errors').ValidationError

exports.match = ( arg ) => _.isArray( arg )
exports.merge = ( a, b ) => a
exports.validate = function( value ) {
  if ( !_.isArray( value ) )
    throw new ValidationError( 'Expected key %s to be Array, got %s instead.', this.key, value )
}
