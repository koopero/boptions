# Status

This module is under development. Check back later.

# Example

This doesn't work yet.

```js
MyFunc.options = boptions( {
  '#linear': [ 'hostname', 'port' ],
  'hostname': {
    '#type': 'string',
    '#default': '127.0.0.1'
  },
  'port': {
    '#type': 'int',
    '#min': 1024,
    '#max': 65535,
    '#default': 31337
  }
})

function MyFunc () {
  const options = MyFunc.options( arguments )
  // options now contains safe, validated options!
}

MyFunc.options()
// { hostname: '127.0.0.1', port: 31337 }

MyFunc.options( 'example.com', 2222 )
// { hostname: 'example.com', port: 2222 }

MyFunc.options( 0 )
// throws ArgumentError -> 'Option port must be in range 1024-65535'

```
- Performance

`boptions` is designed to be flexible, easy to use and thorough. Unfortunately,
this comes at the cost of speed. I would *NOT* recommend using it for functions
that are being called frequently.
