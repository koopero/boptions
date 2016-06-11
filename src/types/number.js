const _ = require('lodash')

exports.match = ( arg ) => _.isNumber( arg )
exports.merge = ( a, b ) => parseFloat( a )
exports.finalize = ( a, b ) => parseFloat( a )
