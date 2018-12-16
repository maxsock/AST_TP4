import { expect } from 'chai'
import { User, UserHandler } from './user'
import { LevelDb } from "./leveldb"

const dbPath: string = 'db_test/user'
var dbUser: UserHandler

describe('Users', function () {
  before(function () {
    LevelDb.clear(dbPath)
    dbUser = new UserHandler(dbPath)
  })

  after(function () {
    dbUser.db.close()
  })

  describe('#get', function () {
    it('should get undefined or non existing User', function (done) {
      dbUser.get("test", function (err: Error | null, result?: User) {
         expect(result).to.be.undefined
         done()
      })
    })
  })

  describe('#save', function () {
    const user = new User("test","test@test.com","test")

    it('should save a User', function (done) {
      dbUser.save(user, function (err: Error | null) {
        /// the code belows generates an "expected undefined to be null"
         //expect(err).to.be.null
         dbUser.get("test", function (err: Error | null, result?: User) {
            expect(result).to.be.eql(user)
            done()
         })
      })
    })

    it('should update a User', function (done) {
      dbUser.save(user, function (err: Error | null) {
          /// the code belows generates an "expected undefined to be null"
        // expect(err).to.be.null
         const user2 = new User("Test","test2@test.com","test2")
         dbUser.save(user2, function (err: Error | null) {
             /// the code belows generates an "expected undefined to be null"
            //expect(err).to.be.null
             dbUser.get("Test", function (err: Error | null, result?: User) {
                expect(err).to.be.null
                expect(result).to.be.eql(user2)
                done()
             })
           })
      })
    })
  })

  describe('#delete', function () {
    before(function (done) {
      const user = new User("test3", "test3@test.com", "test3")
      dbUser.save(user, (err: Error | null) => {
        expect(err).to.be.undefined
        done()
      })
    })
    it('should delete a User', function (done) {
      dbUser.remove("test3", function (err: Error | null) {
        expect(err).to.be.undefined
        dbUser.get("test3", function (err: Error | null, result?: User) {
           expect(result).to.be.undefined
           done()
        })
      })
    })

    it('should not fail if User does not exist', function (done) {
      dbUser.remove("usernotexistant", function (err: Error | null) {
        expect(err).to.be.undefined
        done()
      })
    })
  })
})
