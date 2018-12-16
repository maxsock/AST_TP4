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
    it('should get empty array on non existing group', function (done) {
        dbMet.get("0", function (err: Error | null, result?: Metric[]) {
          expect(err).to.be.null
          expect(result).to.not.be.undefined
          expect(result).to.be.an('array')
          expect(result).to.be.empty
          done()
        })
    })
  })

  describe("#save", function() {
    const met= [new Metric(`${new Date('2013-11-04 14:00 UTC').getTime()}`, 12)]
    const met2= [new Metric(`${new Date('2013-11-04 14:00 UTC').getTime()}`, 2)]

    it('should save data',function(done){
      dbMet.save("1",met,(err: Error | null) => {
        expect(err).to.be.undefined
        dbMet.get("1", function (err: Error | null, result?: Metric[]) {
          expect(result).to.not.be.undefined
          expect(result).to.be.an('array')
          expect(result).to.eql(met)
          done()
        })
      })
    })
    it('should update data',function(done){
      dbMet.save("2",met,(err: Error | null) => {
        expect(err).to.be.undefined
        dbMet.save("2",met2,(err: Error | null) => {
          expect(err).to.be.undefined
          dbMet.get("2", function (err: Error | null, result?: Metric[]) {
            expect(result).to.not.be.undefined
            expect(result).to.be.an('array')
            expect(result).to.eql(met2)
            done()
          })
        })
      })
    })
  })

  describe("#delete", function() {
    const met= [new Metric(`${new Date('2013-11-04 14:00 UTC').getTime()}`, 12)]
    before(function(done){
      dbMet.save("test",met,(err: Error | null) => {
        expect(err).to.be.undefined
        done()
      })
    })
    it('should delete data',function(done){
       dbMet.remove("test",met[0].timestamp,function (err: Error | null) {
         expect(err).to.be.null
         dbMet.get("test", function (err: Error | null, result?: Metric[]) {
           expect(err).to.be.null
           expect(result).to.not.be.undefined
           expect(result).to.be.an('array')
           expect(result).to.be.empty
           done()
         })
       })
    })
    it('should not fail if data does not exist',function(done){
       dbMet.remove("1234","13423",function (err: Error | null) {
         expect(err).to.be.null
         done()
       })
    })
  })
})
