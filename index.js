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
      , type = typeof def

    switch (type) {
      case 'string':
        if ( def[0] == '#' ) {
          def = {
            type: def.substr(1)
          }
          break
        }
        // Yer damn right it falls through. >:-)
      case 'boolean':
      case 'number':
        def = {
          type: type,
          value: def
        }
      break
    }

    // if ( _.isObject( def ) ) {
    //   def = metahash.meta( def )
    // }

    def['key'] = key

    var type = def['type'] || 'any'

    // Load type if it's a string
    if ( _.isString( type ) ) {
      var typeName = type
      if ( !boptions.types[type] )
        dieOnParserOptions( 'Unknown type %s for key %s', type, key )
      type = boptions.types[type]
    }

    // Make sure the type is an object...
    if ( !_.isObject( type ) )
      dieOnParserOptions( 'type for key %s is not an object', key )

    _.defaults( def, type );

    // ... and has the correct methods.
    // ['match', 'append', 'finalize'].map( function ( methodKey ) {
    //   if ( !_.isFunction( def[methodKey] ) )
    //     dieOnParserOptions( 'Method %s for defintion at key %s not found. '+(typeName||''), methodKey, key )
    // })

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
    } else {
      dieOnParserOptions( 'Invalid #inline %s', def )
    }

    return def
  })

  var leftovers = directives.leftovers
  if ( leftovers ) {
    if ( _.isString( leftovers ) ) {
      if ( !definitions[leftovers] )
        dieOnParserOptions( '#leftovers %s does not point to key.', leftovers )
    } else if ( leftovers !== true ) {
      dieOnParserOptions( 'Expected #leftovers to be string or boolean, got %s', leftovers )
    }
  }

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

    const result = {}

    //
    // Apply defaults
    //
    _.map( definitions, function eachDefinition ( def, key ) {
      var value = undefined

      if ( !_.isUndefined( def.value ) )
        value = _.clone( def.value )

      result[key] = value
    })


    //
    // Process inlines
    //
    var inlinesLocal = inlines.slice()
    _.map( args, function eachArg ( arg ) {
      function set( key, value ) {
        const def = definitions[key]

        // Ain't got time for no undefined
        if ( _.isUndefined( value ) )
          return

        if ( def ) {
          if ( def.append ) {
            result[key] = def.append( result[key], value )
          } else {
            result[key] = value
          }
        } else if ( leftovers ) {
          // There's no definition for this key,
          // which means it's a leftover.

          if ( _.isString( leftovers ) ) {
            var wrap = {}
            wrap[key] = value
            set( leftovers, wrap )
          } else {
            result[key] = value
          }
        }
      }

      for ( var inlineIndex = 0; inlineIndex < inlinesLocal.length; inlineIndex ++ ) {
        var inline = inlinesLocal[ inlineIndex ]
        if ( inline && inline.match && inline.match( arg ) ) {
          var def = inline
          set( inline['key'], arg )
          inlinesLocal.splice( inlineIndex, 1 )
          return
        }
      }


      // From henceforth, we'll consider arg to be an object

      // Which keys should we use?
      // If we need to store leftovers, we'll use arg's keys,
      // if not we're better to use the keys from definitions.
      var keys = Object.keys( !!directives['all'] || leftovers ? arg : definitions )
      keys.forEach( function eachKey ( key ) {
        const value = arg[key]
        set( key, value )
      })


    })

    // Do the last of the work for definitions
    _.map( definitions, function eachDefinition ( def, key ) {
      var value = result[key]

      if ( def.finalize )
        value = def.finalize( value )

      if ( def.validate )
        def.validate( value )

      result[key] = value
    })

    return result
  }

  // That's all, folks!
  return parser
}


function inlineMatches( inline, arg ) {
  if ( !inline )
    return false

  if ( !inline.match( arg ) )
    return false

  // @todo
  return true
}
