module.exports = boptions

const _ = require('lodash')
    , metahash = require('metahash')

function boptions() {
  //
  //  The options parser for the options parser generator...
  //  Woah, optionsception. ;)
  //
  //  First, walk through `arguments`, squishing objects into
  //  `options` and functions into `validators`
  //
  const options = {}
      , validators = []

  _.map( arguments, function ( arg ) {
    if ( _.isObject( arg ) ) {
      _.extend( options, arg )
    } else if ( _.isFunction ( arg ) ) {
      validators.push( arg )
    }
  })

  const definitions = {}
  _.map( metahash.data( options ), function parseDefinition ( def, key ) {

    if ( _.isObject( def ) ) {
      definitions[key] = metahash.meta( def )
    } else {
      definitions[key] = {
        'default': def
      }
    }

  } )


  const directives = metahash.meta( options )
  const storeAll = !!directives['all']

  //
  // Here is the main options parser
  //
  const parser = function boptionsParser() {
    // Figure out how we've been called and get a list of arguments to process
    var args
    if ( arguments.length == 1 && _.isArrayLikeObject( arguments[0] ) ) {
      // We've probably been called with the arguments of another function,
      // so we'll just use that arguments object
      args = arguments[0]
    } else {
      // We've been called in some other way, so we'll
      // parse our own arguments
      args = arguments
    }

    //
    //  First pass through arguments.
    //  This will attempt to parse linear arguments,
    //  squish all interesting keys into argsObject
    //  and put everything else in leftovers if it's
    //  worth saving.
    //
    const argsObject = {}
        , linearResults = {}
        , leftovers = {}

    var linearIndex = 0

    _.map( args, function eachArg ( arg ) {
      // From henceforth, we'll consider arg to be an object

      // Which keys should we use?
      // If we need to store leftovers, we'll use arg's keys,
      // if not we're better to use the keys from definitions.
      var keys = Object.keys( storeAll ? arg : definitions )
      keys.forEach( function eachKey ( key ) {
        const value = arg[key]
        const def = definitions[key]

        // Ain't got time for no undefined
        if ( _.isUndefined( value ) )
          return

        if ( def ) {
          argsObject[key] = value
        } else {
          // There's no definition for this key,
          // which means it's a leftover.
          leftovers[key] = value
        }
      })
    })

    const result = {}
    _.map( definitions, function eachDefinition ( def, key ) {
      var value = argsObject[key]

      if ( _.isUndefined( value ) ) {
        value = def['default']
      }

      result[key] = value
    })

    _.extend( result, argsObject )
    _.extend( result, leftovers )
    return result
  }

  // That's all, folks!
  return parser
}
