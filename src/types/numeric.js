const _ = require('lodash')

exports.match = ( arg ) => !isNaN( parseFloat( arg ) )
exports.merge = ( a, b ) => parseFloat( a )
exports.finalize = ( a, b ) => parseFloat( a )
