const _ = require('lodash')

exports.match = ( arg ) => _.isNumber( arg )
exports.merge = ( a, b ) => parseInt( a )
exports.finalize = ( a, b ) => parseInt( a )
