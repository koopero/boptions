([
  'any',
  'array',
  'boolean',
  'extend',
  'function',
  'integer',
  'number',
  'numeric',
  'string'
]).forEach( key =>
  exports[ key ] = require(`./${key}.js`)
)

exports.int = exports.integer
