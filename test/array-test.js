const boptions = require('../index')

describe('type:array',function() {
  it('match', function () {
    const parser = boptions({
      '#inline': ['a'],
      'a': '#array'
    })

    const result = parser( [ [ 'foo' ] ] )

  })
})
