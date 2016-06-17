const _ = require('lodash')

exports.match = ( arg ) => true
exports.append = function extendValueAppend( old, a ) {
  const def = this

  if ( _.isObject( old ) && _.isObject( a ) )
    return _.extend( old, a )

  if ( !_.isObject( old ) && !_.isObject( a ) )
    return a

  if ( !_.isObject( old ) ) {
    old = wrap( old )
  }

  if ( !_.isObject( a ) ) {
    a = wrap( a )
  }

  return _.extend( old, a )

  function wrap( value ) {
    const valueKey = def.valueKey || 'value'
        , wrap = {}
    wrap[valueKey] = value

    return wrap
  }
}
exports.finalize = ( a, b ) => a || {}
