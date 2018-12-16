#!/usr/bin/env ts-node

import { Metric, MetricsHandler } from '../src/metrics'
import { UserHandler, User } from '../src/user'
var moment = require('moment');

const met = [
  new Metric(`${moment.utc('2013-11-04T14:00').format("X")}`, 12),
  new Metric(`${moment.utc('2013-11-04T14:15').format("X")}`, 10),
  new Metric(`${moment.utc('2013-11-04T14:30').format("X")}`, 8)
]


const users = [
  new User('JohnD','12345','john@doe.com'),
  new User('JaneD','12345','jane@doe.com')
]

const dbMet = new MetricsHandler('./db/metrics')

dbMet.save("0", met, (err: Error | null) => {
  if (err) throw err
  console.log('Data populated')
})
dbMet.db.close()
while(dbMet.db.isOpen()){
}

const dbUser = new UserHandler('./db/users')

users.forEach((u: User) => {
  dbUser.save(u, function(err: Error | null) {
    if (err) throw err
    console.log('Data populated')
  })
})

dbUser.db.close()
