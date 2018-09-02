const express = require('express')
var bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')
var SEED = require('../config/config').SEED



var app = express()
var Usuario = require('../models/usuario')

// ==========================================================================
// => Login de Usuario
// ==========================================================================
app.post('/', (req, res) => {
  var body = req.body

  Usuario.findOne({
    email: body.email
  }, (err, usuarioDB) => {

    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al buscar Usuario',
        errors: err
      })
    }
    if (!usuarioDB) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Credenciales incorrectas -email',
        errors: {
          message: 'Credenciales incorrectas -email'
        }
      })
    }
    if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Credenciales incorrectas -password',
        errors: {
          message: 'Credenciales incorrectas -password'
        }
      })
    }
    usuarioDB.password = ':)'
    //Crear un token
    var token = jwt.sign({
      usuario: usuarioDB
    }, SEED, {
      expiresIn: 14400
    })
    res.status(200).json({
      ok: true,
      token,
      usuario: usuarioDB,
      id: usuarioDB._id
    })
  })


})
module.exports = app
