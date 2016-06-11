const boptions = require('../index')
const ass = require('chai').assert
    , eq = ass.deepEqual

describe('application', function () {
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

    it('will get path and type', function () {
      eq(
        parser( 'path', 'type' )
        , {
          path: 'path',
          type: 'type',
          data: {},
          time: 0
        }
      )
    })

    it('will get data', function () {
      eq(
        parser( 'path', 'type', { foo: 'bar' } )
        , {
          path: 'path',
          type: 'type',
          data: { foo: 'bar' },
          time: 0
        }
      )
    })

  })
})
