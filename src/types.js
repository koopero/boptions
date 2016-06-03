const requireDir = require('require-dir')

// Types from directory
const types = module.exports = requireDir( './types')

// Aliases
types.int = types.integer
