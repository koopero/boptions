const assert = require('chai').assert

const boptions = require('../index')

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

    it('will parse out of order using #type', function () {
      const parser = boptions( {
        '#inline': [ 'hostname', 'port' ],
        'hostname': {
          type: 'string',
          default: '127.0.0.1'
        },
        'port': {
          type: 'int',
          default: 25
        }
      })

      assert.deepEqual(
        parser( 25, 'localhost' ),
        { 'hostname': 'localhost', 'port': 25 }
      )

      assert.deepEqual(
        parser( 'localhost', 25 ),
        { 'hostname': 'localhost', 'port': 25 }
      )
    })

    it('will parse multiple values of same #type', function () {
      const parser = boptions( {
        '#inline': [ 'a', 'b' ],
        'a': {
          type: 'string',
        },
        'b': {
          type: 'string',
        }
      })

      assert.deepEqual(
        parser( 'bar', 'foo' ),
        { a: 'bar', b: 'foo' }
      )

    })

  })
})
