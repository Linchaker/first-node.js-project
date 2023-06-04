const express = require('express')
const config = require('./config')
const path = require('path')
const mongoose = require('mongoose');
const csrf = require('csurf')
const flash = require('connect-flash')
const helmet = require('helmet')
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
const profileRoutes = require('./routes/profile')

const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')
const errorHandler = require('./middleware/error')
const fileMiddleware = require('./middleware/file')


const app = express()

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  helpers: require('./utils/hbs-helpers')
})
const store = new MongoStore({
  collection: 'sessions',
  uri: config.MONGO_CONNECT
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

// set access to public folder as root folder
app.use(express.static(path.join(__dirname, 'public')))
// set access to image folder
app.use('/images', express.static(path.join(__dirname, 'images')))
// enable parse forms
app.use(express.urlencoded({extended: true}))
// enable put/delete http method support
app.use(methodOverride('_method'))
// enable sessions
app.use(session({
  secret: config.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store
}))
app.use(fileMiddleware.single('avatar'))
app.use(csrf())
app.use(flash())
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      "img-src": ["'self'", "https: data:"],
    },
  },
}))
// custom middleware
app.use(varMiddleware)
app.use(userMiddleware)

app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/card', cardRoutes)
app.use('/orders', ordersRoutes)
app.use('/auth', authRoutes)
app.use('/profile', profileRoutes)

app.use(errorHandler)


async function start() {
  try {
    await mongoose
  .connect(config.MONGO_CONNECT, {useNewUrlParser: true})
  .then((res) => console.log('Connected to DB'))
  .catch((error) => console.log(error));

  app.listen(config.PORT, config.HOST, (error) => {
    error ? console.log(error) : console.log(`Server running at http://${config.HOST}:${config.PORT}/`);
  })
  } catch (e) {
    console.log(e);
  }
}

start()