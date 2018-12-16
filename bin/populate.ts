#!/usr/bin/env ts-node

import { Metric, MetricsHandler } from '../src/metrics'
import { UserHandler, User } from '../src/user'
var moment = require('moment');

const met1 = [
  new Metric(`${moment.utc('2013-11-04T14:00').format("X")}`, 12),
  new Metric(`${moment.utc('2013-11-04T14:15').format("X")}`, 10),
  new Metric(`${moment.utc('2013-11-04T14:30').format("X")}`, 8),
  new Metric(`${moment.utc('2013-11-04T14:45').format("X")}`, 6),
  new Metric(`${moment.utc('2013-11-04T15:00').format("X")}`, 11),
  new Metric(`${moment.utc('2013-11-04T15:15').format("X")}`, 13)
]
const met2 = [
  new Metric(`${moment.utc('2013-11-04T14:00').format("X")}`, 6),
  new Metric(`${moment.utc('2013-11-04T14:15').format("X")}`, 8),
  new Metric(`${moment.utc('2013-11-04T14:30').format("X")}`, 12),
  new Metric(`${moment.utc('2013-11-04T14:45').format("X")}`, 13),
  new Metric(`${moment.utc('2013-11-04T15:00').format("X")}`, 15),
  new Metric(`${moment.utc('2013-11-04T15:15').format("X")}`, 13),
  new Metric(`${moment.utc('2013-11-04T16:00').format("X")}`, 12),
  new Metric(`${moment.utc('2013-11-04T16:15').format("X")}`, 14),
  new Metric(`${moment.utc('2013-11-04T16:30').format("X")}`, 12),
  new Metric(`${moment.utc('2013-11-04T16:45').format("X")}`, 11),
  new Metric(`${moment.utc('2013-11-04T17:00').format("X")}`, 11),
  new Metric(`${moment.utc('2013-11-04T17:15').format("X")}`, 13)
]

const users = [
  new User('jane','jane@doe.com','jane123'),
  new User('kurt','kurt@weller.com','kurt123')
]


const dbUser = new UserHandler('./db/users')

users.forEach((u: User) => {
  dbUser.save(u, function(err: Error | null) {
    if (err) throw err
  })
})

dbUser.db.close().then(function(){
  console.log("User 1: jane | email: jane@doe.com | password: jane123")
  console.log("User 2: kurt | email: kurt@weller.com | password: kurt123")

  const dbMet = new MetricsHandler('./db/metrics')
  dbMet.save("kurt", met1, (err: Error | null) => {
    if (err) throw err
    console.log('6 metrics added for Kurt')
  })

  dbMet.save("jane", met2, (err: Error | null) => {
    if (err) throw err
    console.log('12 metrics added for Jane')
  })

  dbMet.db.close()
})
