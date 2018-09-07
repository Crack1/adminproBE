const express = require('express')
var bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')
var SEED = require('../config/config').SEED
var GOOGLE_CLIENT_ID = require('../config/config').GOOGLE_CLIENT_ID
var GOOGLE_SECRET = require('../config/config').GOOGLE_SECRET

const {
  OAuth2Client
} = require('google-auth-library');
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

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


// ==========================================================================
// => Autenticacion con Google
// ==========================================================================

app.post('/google', (req, res) => {

  var token = req.body.token
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];

    Usuario.findOne({
      email: payload.email
    }, (err, usuario) => {
      if (err) {
        return res.status(500).json({
          ok: true,
          mensaje: 'Error al buscar usuario - login',
          errors: e
        })
      }

      if (usuario) {
        if (usuario.google === false) {
          return res.status(400).json({
            ok: true,
            mensaje: 'Debe de usar su autenticacion por google',
            errors: e
          })
        } else {
          usuarioDB.password = ':)'
          //Crear un token
          var token = jwt.sign({
            usuario: usuario
          }, SEED, {
            expiresIn: 14400
          })
          res.status(200).json({
            ok: true,
            token,
            usuario: usuario,
            id: usuario._id
          })
        }
      } else {
        //si el usuario no existe por correo
        var usuario = new Usuario()
        usuario.nombre = payload.name
        usuario.email = payload.email
        usuario.password = ':)'
        usuario.img = payload.picture
        usuario.google = true
        usuario.save((err, usuarioDB) => {
          if (err) {
            return res.status(500).json({
              ok: true,
              mensaje: 'Error al crear usuario - google',
              errors: e
            })
          }
          //Crear un token
          var token = jwt.sign({
            usuario: usuario
          }, SEED, {
            expiresIn: 14400
          })
          res.status(200).json({
            ok: true,
            token,
            usuario: usuario,
            id: usuario._id
          })
        })
      }
    })
  }
  verify().catch(console.error);

})

module.exports = app
