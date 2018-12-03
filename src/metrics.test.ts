import { expect } from 'chai'
import { Metric, MetricsHandler } from './metrics'
import { LevelDb } from "./leveldb"


const dbPath: string = 'db_test'
//var dbMet: MetricsHandler
var dbMet = new MetricsHandler('./db/metrics')

describe('Metrics', function () {
  before(function () {
    LevelDb.clear(dbPath)
    dbMet = new MetricsHandler(dbPath)
  })

  after(function () {
    dbMet.db.close()
  })


  describe("#get", function() {
    it('should get empty array on non existing group', function () {
        dbMet.get("0", function (err: Error | null, result?: Metric[]) {
          expect(err).to.be.null
          expect(result).to.not.be.undefined
          expect(result).to.be.an('array')
          expect(result).to.be.empty
        })
    })
  })

  describe("#save", function() {
    it('should save data',function(){
      const met= [new Metric(`${new Date('2013-11-04 14:00 UTC').getTime()}`, 12)]
      dbMet.save("1",met,(err: Error | null) => {
        //expect(err).to.be.undefined
      })
    })
    it('should update data',function(){
      // const met= [new Metric(`${new Date('2013-11-04 14:00 UTC').getTime()}`, 12)]
      // dbMet.save("0",met,(err: Error | null) => {
      //   expect(err).to.be.null
      // })
    })
  })

  describe("#delete", function() {
    it('should delete data',function(){
      // dbMet.remove(0,function (err: Error | null) {
      //   expect(err).to.be.null
      // })
    })
    it('should not fail if data does not exist',function(){
      // dbMet.remove(1234,function (err: Error | null) {
      //   expect(err).to.be.null
      // })
    })
  })
})
