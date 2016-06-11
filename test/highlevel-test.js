const boptions = require('../index')
const ass = require('chai').assert
    , eq = ass.deepEqual

describe('applications', function () {
  describe('loopin.event', function () {
    const parser = boptions({
      '#inline': ['path','type','time'],
      '#leftovers': 'data',
      'path': '<unknown>',
      'type': '<unknown>',
      'data': '#extend',
      'time': 0
    })

    it('will get defaults', function () {
      eq(
        parser()
        , {
          path: '<unknown>',
          type: '<unknown>',
          data: {},
          time: 0
        }
      )
    })

  })
})
