const express = require('express')
const path = require('path')
const mongoose = require('mongoose');
const csrf = require('csurf')
const flash = require('connect-flash')
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

const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')


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
app.use(csrf())
app.use(flash())
// custom middleware
app.use(varMiddleware)
app.use(userMiddleware)

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