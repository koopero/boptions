const _ = require('lodash')
exports.match = ( arg ) => _.isObject( arg )
exports.merge = ( a, b ) => _.extend( a || {}, b )
exports.finalize = ( a, b ) => a || {}
