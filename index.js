module.exports = boptions

const _ = require('lodash')
    , metahash = require('metahash')

_.extend( boptions, require('./src/presets' ) )
boptions.types = require('./src/types')

function boptions() {
  //
  //  The options parser for the options parser generator...
  //  Woah, optionsception. ;)
  //
  //  First, walk through `arguments`, squishing objects into
  //  `options` and functions into `validators`
  //

  function dieOnParserOptions( msg ) {
    var argI = 1
      , args = arguments

    msg = msg.replace( /%s/g, function () {
      return JSON.stringify( args[argI++] )
    })
    throw new Error( msg )
  }

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

    var def
    if ( _.isObject( def ) ) {
      def = metahash.meta( def )
    } else {
      def = {
        'default': def
      }
    }

    def['key'] = key

    var type = def['type'] || 'any'

    // Load type if it's a string
    if ( _.isString( type ) ) {
      if ( !boptions.types[type] )
        dieOnParserOptions( 'Unknown type %s for key %s', type, key )
      type = boptions.types[type]
    }

    // Make sure the type is an object...
    if ( !_.isObject( type ) )
      dieOnParserOptions( 'type for key %s is not an object', key )

    // ... and has the correct methods.
    ['match', 'merge', 'finalize'].map( function ( methodKey ) {
      if ( !_.isFunction( type[methodKey] ) )
        dieOnParserOptions( 'Method %s for type at key %s not found.', methodKey, key )
    })

    def['type'] = type

    definitions[key] = def

  } )

  const directives = metahash.meta( options )

  if ( _.isString( directives.inline ) )
    directives.inline = directives.inline.split( ',' )

  const inlines = _.map( directives.inline, function parseInline( def ) {
    if ( _.isString( def ) ) {
      const key = def
      def = definitions[key]

      if ( !def ) {
        dieOnParserOptions( 'No key definition for #inline %s', key )
      }
    } else if ( _.isObject( def ) ) {
      def = metahash.meta( def )
    } else {
      dieOnParserOptions( 'Invalid #inline %s', def )
    }

    return def
  })

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
        , inlineResults = {}
        , leftovers = {}

    var inlineIndex = 0

    _.map( args, function eachArg ( arg ) {

      var inline = inlines[ inlineIndex ]
      if ( inlineMatches( inline, arg ) ) {
        inlineResults[ inline['key'] ] = arg
        inlineIndex ++
      }

      // From henceforth, we'll consider arg to be an object

      // Which keys should we use?
      // If we need to store leftovers, we'll use arg's keys,
      // if not we're better to use the keys from definitions.
      var keys = Object.keys( !!directives['all'] ? arg : definitions )
      keys.forEach( function eachKey ( key ) {
        const value = arg[key]
        const def = definitions[key]

        // Ain't got time for no undefined
        if ( _.isUndefined( value ) )
          return

        if ( def ) {
          const type = def.type
          argsObject[key] = type.merge( value, argsObject[key] )
        } else {
          // There's no definition for this key,
          // which means it's a leftover.
          leftovers[key] = value
        }
      })
    })

    // @todo Check for conflicts between argsObject & inlineResults
    _.extend( argsObject, inlineResults )

    const result = {}
    _.map( definitions, function eachDefinition ( def, key ) {
      const type = def['type']
      var value = argsObject[key]


      if ( _.isUndefined( value ) ) {
        value = def['default']
      }

      value = type.finalize( value )

      result[key] = value
    })


    _.extend( result, leftovers )
    return result
  }

  // That's all, folks!
  return parser
}


function inlineMatches( inline, arg ) {
  if ( !inline )
    return false

  if ( !inline['type'].match( arg ) )
    return false

  // @todo
  return true
}
