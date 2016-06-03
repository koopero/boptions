const _ = require('lodash')
exports.match = ( arg ) => _.isString( arg )
exports.merge = ( a, b ) => String( a )
exports.finalize = ( a, b ) => String( a )
