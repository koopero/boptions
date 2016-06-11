const assert = require('chai').assert

const boptions = require('../index')

describe('definitions', function () {
  describe('#type', function () {
    it('forces type', function () {

      const parser = boptions( {
        'string': '#string',
        'int':    '#int'
      })

      assert.deepEqual(
        parser( { string: 45, int: '45' } ),
        { string: '45', int: 45 }
      )
    })
  })

  describe('#default', function () {
    it('will add some defaults', function () {
      const parser = boptions( {
        foo: {
          type: 'string',
          value: 'bar'
        }
      } )

      const result = parser()
      assert.deepEqual( result, { foo: 'bar' } )
    })
  })
})
