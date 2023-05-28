const express = require('express')
const path = require('path')
const mongoose = require('mongoose');
require('dotenv').config();
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)


const homeRoutes = require('./routes/home')
const cardRoutes = require('./routes/card')
const addRoutes = require('./routes/add')
const ordersRoutes = require('./routes/orders')
const coursesRoutes = require('./routes/courses')
const authRoutes = require('./routes/auth')
const User = require('./models/user')

const varMiddleware = require('./middleware/variables')


const app = express()

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
})
const store = new MongoStore({
  collection: 'sessions',
  uri: process.env.MONGO_CONNECT
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

// app.use(async (req, res, next) => {
//   try {
//     const user = await User.findById('6471ebccefc403dd0ed70a2d')
//     req.user = user
//     next()
//   } catch (e) {
//     console.log(e);
//   }
// })

// set access to public folder as root folder
app.use(express.static(path.join(__dirname, 'public')))
// enable parse forms
app.use(express.urlencoded({extended: true}))
// enable put/delete http method support
app.use(methodOverride('_method'))
// enable sessions
app.use(session({
  secret: 'some secret value',
  resave: false,
  saveUninitialized: false,
  store
}))
// custom middleware
app.use(varMiddleware)

app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/card', cardRoutes)
app.use('/orders', ordersRoutes)
app.use('/auth', authRoutes)



async function start() {
  try {
    await mongoose
  .connect(process.env.MONGO_CONNECT, {useNewUrlParser: true})
  .then((res) => console.log('Connected to DB'))
  .catch((error) => console.log(error));

  app.listen(process.env.PORT, process.env.HOST, (error) => {
    error ? console.log(error) : console.log(`Server running at http://${process.env.HOST}:${process.env.PORT}/`);
  })
  } catch (e) {
    console.log(e);
  }
}

start()