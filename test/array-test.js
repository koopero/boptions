const boptions = require('../index')

describe('type:array',function() {
  it('match', function () {
    const parser = boptions({
      '#inline': ['a'],
      'a': {
        '#type': 'array'
      }
    })

    const result = parser( [ 'foo' ] )

  })
})
