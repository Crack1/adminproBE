const express = require('express')
const mongoose = require('mongoose');
const port = process.env.PORT || 3000
var app = express()


///conexion a la base de datos
mongoose.connect('mongodb://localhost:27017/hospitalDB', (err, res) => {
  if (err) {
    throw err
  }
  console.log(`Base de datos: \x1b[32m%s\x1b[0m`, 'online')
})

app.get('/', (req, res) => {
  res.status(200).json({
    ok: true,
    mensaje: 'Peticion realizada correctamente NODEMON'
  })
})
app.listen(port, () => {
  console.log(`Server Express in port ${port}: \x1b[32m%s\x1b[0m`, 'online')
})
