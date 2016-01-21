const assert = require('chai').assert

const boptions = require('../index')

describe('boptions', function () {
  it('will not smoke', function () {
    const parser = boptions()

    assert.isFunction( parser )

    const result = parser([])

    assert.isObject( result )
  })

  it('will parse some options', function () {
    const parser = boptions( {
      foo: {
        '#type': 'string'
      }
    } )

    const result = parser( { foo: 'bar'} )

    assert.isObject( result )
    assert.deepEqual( result, { foo: 'bar' } )
  })

  it('will add some defaults', function () {
    const parser = boptions( {
      foo: {
        '#type': 'string',
        "#default": 'bar'
      }
    } )

    const result = parser()
    assert.deepEqual( result, { foo: 'bar' } )
  })

  describe('directives', function () {
    describe('#inline', function () {
      it('will parse in order', function () {
        const parser = boptions( {
          '#inline': [ 'hostname', 'port' ],
          'hostname': '127.0.0.1',
          'port': 25
        })

        assert.deepEqual(
          parser(),
          { 'hostname': '127.0.0.1', 'port': 25 }
        )

        assert.deepEqual(
          parser( 'localhost' ),
          { 'hostname': 'localhost', 'port': 25 }
        )

        assert.deepEqual(
          parser( 'example.com', 80 ),
          { 'hostname': 'example.com', 'port': 80 }
        )
      })
    })
  })
})
