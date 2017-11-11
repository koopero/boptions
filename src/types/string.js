const _ = require('lodash')
exports.match = ( arg ) => _.isString( arg )
exports.append = ( a, b ) => b
exports.finalize = ( a ) => String( a )
