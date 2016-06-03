const boptions = require('../index')

const _ = require('lodash')
    , assert = require('chai').assert
    , deepEqual = assert.deepEqual

function presetEqual( a, b ) {

  // Forces to be objects,
  // as object-like functions are
  // valid.
  a = _.extend( {}, a )
  b = _.extend( {}, b )

  assert.deepEqual( a, b )
}

describe( 'presets', function () {
  describe('integer', function () {
    it('will preset', function () {
      presetEqual(
        boptions.integer,
        {
          '#type': 'int'
        }
      )
    })

    it('will work as part of parser', function () {
      const parser = boptions({
        '#inline': [ 'a' ],
        'a': boptions.numeric
      })

      deepEqual(
        parser( '45' ),
        { a: 45 }
      )

    })

  })
})
