const express = require('express')
const mongoose = require('mongoose');
var bodyParser = require('body-parser')

const port = process.env.PORT || 3000
var app = express()

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS")
  next();
});


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
var hospitalRoutes = require('./routes/hospital')
var medicoRoutes = require('./routes/medico')
var loginRoutes = require('./routes/login')
var busquedaRoutes = require('./routes/busqueda')
var uploadRoutes = require('./routes/upload')
var ImagenesRoutes = require('./routes/imagenes')



///conexion a la base de datos
mongoose.connect('mongodb://localhost:27017/hospitalDB', (err, res) => {
  if (err) {
    throw err
  }
  console.log(`Base de datos: \x1b[32m%s\x1b[0m`, 'online')
})

//RUTAS
app.use('/usuario', usuarioRoutes)
app.use('/hospital', hospitalRoutes)
app.use('/medico', medicoRoutes)
app.use('/login', loginRoutes)
app.use('/busqueda', busquedaRoutes)
app.use('/upload', uploadRoutes)
app.use('/img', ImagenesRoutes)

app.use('/', appRoutes)

app.listen(port, () => {
  console.log(`Server Express in port ${port}: \x1b[32m%s\x1b[0m`, 'online')
})
