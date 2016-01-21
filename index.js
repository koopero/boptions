module.exports = boptions

const _ = require('lodash')
    , metahash = require('metahash')

_.extend( boptions, require('./src/presets' ) )

function boptions() {
  //
  //  The options parser for the options parser generator...
  //  Woah, optionsception. ;)
  //
  //  First, walk through `arguments`, squishing objects into
  //  `options` and functions into `validators`
  //

  function dieOnParserOptions( msg, key ) {
    throw new ArgumentError( msg )
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

    if ( _.isObject( def ) ) {
      definitions[key] = metahash.meta( def )
    } else {
      definitions[key] = {
        'default': def
      }
    }

    definitions[key]['key'] = key

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
          argsObject[key] = value
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
      var value = argsObject[key]

      if ( _.isUndefined( value ) ) {
        value = def['default']
      }

      value = typeApply( def['type'], value )

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

  if ( !typeMatches( inline['type'], arg ) )
    return false

  // @todo
  return true
}

// #type
function typeMatches( type, arg ) {
  if ( _.isString( type ) ) {
    switch ( type ) {
      case 'string':
        if ( !_.isString( arg ) )
          return false
      break

      case 'float':
      case 'number':
      case 'int':
        const num = parseInt( arg )
        if ( isNaN( num ) )
          return false
      break

      default:
        return false
    }
  }

  return true
}

function typeApply( type, arg ) {
  if ( _.isString( type ) ) {
    switch ( type ) {
      case 'string':
        return String( arg )
      break

      case 'float':
      case 'number':
        return parseFloat( arg )

      case 'int':
        return parseInt( arg )
    }
  }

  return arg
}
