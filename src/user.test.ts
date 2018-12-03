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
    it('should get undefined or non existing User', function () {
      dbUser.get("test", function (err: Error | null, result?: User) {
        expect(err).to.be.null
        expect(result).to.not.be.null
        expect(result).to.not.be.undefined
      })
    })
  })

  describe('#save', function () {
    it('should save a User', function () {
      const user = new User("test","test@test.com","test")
      dbUser.save(user, function (err: Error | null) {
        expect(err).to.be.null
      })
    })

    it('should update a User', function () {
      const user = new User("test","test@test.com","test")
      dbUser.save(user, function (err: Error | null) {
        expect(err).to.be.null
      })
    })
  })

  describe('#delete', function () {
    it('should delete a User', function () {
      dbUser.remove("test", function (err: Error | null) {
        expect(err).to.be.null
      })
    })

    it('should not fail if User does not exist', function () {
      dbUser.remove("usernotexistant", function (err: Error | null) {
        expect(err).to.be.null
      })
    })
  })
})
