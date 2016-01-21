# Status

This module is under development. Check back later.

# Example

```js
MyFunc.options = boptions( {
  '#inline': [ 'hostname', 'port' ],
  'hostname': {
    '#type': 'string',
    '#default': '127.0.0.1'
  },
  'port': {
    '#type': 'int',
    '#min': 1024,
    '#max': 65535,
    '#default': 31337
  },
  'encoding': 'ascii'
})

function MyFunc () {
  const options = MyFunc.options( arguments )
  // options now contains safe, validated options!
}

deepEqual( )
  MyFunc.options(),
  { hostname: '127.0.0.1', port: 31337, encoding: 'ascii' }
)

deepEqual(
  MyFunc.options( 'example.com', 2222 ),
  { hostname: 'example.com', port: 2222, encoding: 'ascii' }
)

deepEqual(
  MyFunc.options( { hostname: '10.10.10.10' }, { encoding: 'utf8' } ),
  { hostname: '10.10.10.10', port: 2222, encoding: 'utf8' }
)

MyFunc.options( 0 )
// throws ArgumentError -> 'Option port must be in range 1024-65535'

```
- Performance

`boptions` is designed to be flexible, easy to use and thorough. Unfortunately,
this comes at the cost of speed. I would *NOT* recommend using it for functions
that are being called frequently.
