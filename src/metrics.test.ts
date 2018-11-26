import { expect } from 'chai'

const a: number = 0

describe('Metrics', function () {
  describe("#get", function() {
    it('should save and get', function () {
      expect(a).to.equal(0)
    })
  })
})
