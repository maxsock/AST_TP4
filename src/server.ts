import express = require('express')
import { MetricsHandler, Metric } from './metrics'
import bodyparser = require('body-parser')
import morgan = require('morgan')
import session = require('express-session')
import levelSession = require('level-session-store')
import { UserHandler, User } from './user'
import path = require('path')

const LevelStore = levelSession(session)

const app = express()
const port: string = process.env.PORT || '8080'

const dbMet = new MetricsHandler('./db/metrics')
const dbUser: UserHandler = new UserHandler('./db/users')


app.use(bodyparser.json())
app.use(bodyparser.urlencoded())
app.use(morgan('dev'))
app.use(session({
  secret: 'my very secret phrase',
  store: new LevelStore('./db/sessions'),
  resave: true,
  saveUninitialized: true
}))

app.set('views', __dirname + "/../views")
app.set('view engine', 'ejs');

app.use('/', express.static(path.join(__dirname,'/../node_modules/jquery/dist')))
app.use('/', express.static(path.join(__dirname,'/../node_modules/boostrap/dist')))

/*
  Authentication
*/

const authRouter = express.Router()

app.use(authRouter)

authRouter.get('/login', (req: any, res: any) => {
  res.render('login')
})

authRouter.post('/login', (req: any, res: any, next: any) => {
  dbUser.get(req.body.username, (err: Error | null, result?: User) => {
    if (err) next(err)
    if (result === undefined || !result.validatePassword(req.body.password)) {
      res.redirect('/login')
    } else {
      req.session.loggedIn = true
      req.session.user = result
      res.redirect('/')
    }
  })
})

authRouter.get('/signup', (req: any, res: any) => {
  res.render('signup')
})

authRouter.get('/logout', (req: any, res: any) => {
  delete req.session.loggedIn
  delete req.session.user
  res.redirect('/login')
})


/*
  Users
*/

const userRouter = express.Router()


userRouter.get('/:username', (req: any, res: any, next: any) => {
  dbUser.get(req.params.username, (err: Error | null, result?: User) => {
    if(result === undefined || err ){
      res.status(404).send("user not found")
    }
    else {
      res.status(200).json(result)
    }
  })
})

userRouter.post('/', (req: any, res: any, next: any) => {
  dbUser.get(req.body.username, (err: Error | null, result?: User) => {
    if(result === undefined || !err ){
      res.status(409).send("user already exists")
    } else {
      dbUser.save(req.body, (err: Error | null) => {
        if (err) next(err)
        res.status(201).send("user persisted")
      })
    }
  })
})


// TODO: Update user

app.use('/user',userRouter)

const authCheck = function (req: any, res: any, next: any) {
  if (req.session.loggedIn) {
    next()
  } else res.redirect('/login')
}





/*
  Root
*/

app.use(function (req: any, res: any, next: any) {
  console.log(req.method + ' on ' + req.url)
  next()
})

app.get('/',authCheck,(req: any, res:any) => {
  res.render('index', {req.session.username})
})





const router = express.Router()

router.use(function (req: any, res: any, next: any) {
  console.log('called metrics router')
  next()
})

router.get('/:id', (req: any, res: any) => {
  dbMet.get(req.params.id, (err: Error | null, result?: Metric[]) => {
    if (err) throw err
    if (result === undefined) {
      res.write('no result')
      res.send()
    }
    else res.json(result)
  })
})

app.post('/:id', (req: any, res: any) => {
  dbMet.save(req.params.id, req.body, (err: Error | null) => {
    if (err) {
      res.status(500).send(err.message)
    }
    res.status(200).send("Success")
  })
})

app.use('/metrics', authCheck, router)


app.delete('/metrics/:id', (req: any, res: any) => {
  dbMet.delete(req.params.id, (err: Error | null) => {
    if (err) {
      res.status(500).send(err.message)
    }
    res.status(200).send()
  })
})

app.use(function (err: Error, req: any, res: any, next: any) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(port, (err: Error) => {
  if (err) throw err
  console.log(`server is listening on port ${port}`)
})
