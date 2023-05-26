const express = require('express')
const path = require('path')
const mongoose = require('mongoose');
require('dotenv').config();
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')

const homeRoutes = require('./routes/home')
const cardRoutes = require('./routes/card')
const addRoutes = require('./routes/add')
const coursesRoutes = require('./routes/courses')

const app = express()

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
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

app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/card', cardRoutes)



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