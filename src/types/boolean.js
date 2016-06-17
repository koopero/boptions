const _ = require('lodash')

exports.match = ( arg ) => _.isBoolean( arg )
exports.merge = ( old, a ) => !!a
exports.finalize = ( a ) => !!a
