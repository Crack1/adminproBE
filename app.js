const express = require('express')
const mongoose = require('mongoose');
var bodyParser = require('body-parser')

const port = process.env.PORT || 3000
var app = express()


//bodyParser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}))
// parse application/json
app.use(bodyParser.json())

//Importar rutas
var appRoutes = require('./routes/app')
var usuarioRoutes = require('./routes/usuario')
var loginRoutes = require('./routes/login')



///conexion a la base de datos
mongoose.connect('mongodb://localhost:27017/hospitalDB', (err, res) => {
  if (err) {
    throw err
  }
  console.log(`Base de datos: \x1b[32m%s\x1b[0m`, 'online')
})

//RUTAS
app.use('/usuario', usuarioRoutes)
app.use('/login', loginRoutes)
app.use('/', appRoutes)

app.listen(port, () => {
  console.log(`Server Express in port ${port}: \x1b[32m%s\x1b[0m`, 'online')
})
