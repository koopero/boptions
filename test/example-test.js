describe('examples', function () {
  it('README', function () {

    const boptions = require('../index')
    const assert = require('chai').assert
        , deepEqual = assert.deepEqual

    // ---------------------- <<

    MyFunc.options = boptions( {
      '#inline': [ 'hostname', 'port' ],
      'hostname': '127.0.0.1',
      'port': {
        'type': 'int',
        'min': 1024,
        'max': 65535,
        'value': 31337
      },
      'encoding': 'ascii'
    })

    function MyFunc () {
      const options = MyFunc.options( arguments )
      // options now contains safe, validated options!
    }

    deepEqual(
      MyFunc.options(),
      { hostname: '127.0.0.1', port: 31337, encoding: 'ascii' }
    )

    deepEqual(
      MyFunc.options( 'example.com', 2222 ),
      { hostname: 'example.com', port: 2222, encoding: 'ascii' }
    )

    deepEqual(
      MyFunc.options( { hostname: '10.10.10.10' }, { encoding: 'utf8' } ),
      { hostname: '10.10.10.10', port: 31337, encoding: 'utf8' }
    )

    MyFunc.options( 0 )
    // throws ArgumentError -> 'Option port must be in range 1024-65535'

    // >> ----------------------

  })
})
