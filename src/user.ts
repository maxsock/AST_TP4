import { LevelDb } from "./leveldb"
import WriteStream from 'level-ws'
var passwordHash = require('password-hash');

export class User {
  public username: string
  public email: string
  public password: string = ""

  constructor(username: string, email: string, password: string, passwordHashed: boolean = false) {
    this.username = username
    this.email = email

    if (!passwordHashed) {
      this.setPassword(password)
    } else this.password = password

  }

  static fromDb(username: string, value: any): User {
    const [password, email] = value.split(":")
    // Parse db result and return a User
    return new User(username, email, password)
  }

  public setPassword(toSet: string): void {
    // Hash and set password
    this.password = passwordHash.generate(toSet);
  }

  public getPassword(): string {
    return this.password
  }

  public validatePassword(toValidate: String): boolean {
    // return comparison with hashed password
    return passwordHash.verify(toValidate,this.password);
  }
}


export class UserHandler {
  public db: any

  constructor(path: string) {
    this.db = LevelDb.open(path)
  }

  public get(username: string, callback: (err: Error | null, result?: User) => void) {
    this.db.get(`user:${username}`, function (err: Error, data: any) {
      if (err) callback(err)
      else if(data === undefined) callback(null,data)
      else callback(null, User.fromDb(username, data))

    })
  }

  public save(user: User, callback: (err: Error | null) => void) {
    this.db.put(`user:${user.username}`,`${user.getPassword()}:${user.email}`,(err: Error | null) => {callback(err)})
  }

  public remove(username: string, callback: (err: Error | null) => void) {
    this.db.del(`user:${username}`,(err: Error | null) => {callback(err)})
  }


}
