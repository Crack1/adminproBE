const express = require('express')
var bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')
var mdwAuth = require('../middlewares/autenticacion')

var app = express()

var Usuario = require('../models/usuario')
// ==========================================================================
// => Obtener todos los usuarios
// ==========================================================================
app.get('/', (req, res) => {
  Usuario.find({}, 'nombre email imagen role').exec((err, usuarios) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error cargando Usuarios',
        errors: err
      })
    }
    res.status(200).json({
      ok: true,
      usuarios: usuarios
    })
  })
})

// ==========================================================================
// => Actualizar usuario
// ==========================================================================
app.put('/:id', mdwAuth.verificaToken, (req, res) => {
  var id = req.params.id
  var body = req.body

  Usuario.findById(id, (err, usuario) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al buscar Usuario',
        errors: err
      })
    }
    if (!usuario) {
      return res.status(400).json({
        ok: false,
        mensaje: 'El usuario con el id' + id + ' no existe',
        errors: {
          message: 'No existe un usuario con ese ID'
        }
      })
    }
    usuario.nombre = body.nombre
    usuario.email = body.email
    usuario.role = body.role
    usuario.save((err, usuarioGuardado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Error al actualizar Usuario',
          errors: err
        })
      }
      usuarioGuardado.password = ':)'
      res.status(200).json({
        ok: true,
        usuario: usuarioGuardado
      })
    })
  })
})
// ==========================================================================
// => Crear un nuevo Usuario
// ==========================================================================

app.post('/', mdwAuth.verificaToken, (req, res) => {

  var body = req.body
  var usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    img: body.img,
    role: body.role
  })
  usuario.save((err, usuarioGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al crear Usuario',
        errors: err
      })
    }
    res.status(201).json({
      ok: true,
      usuario: usuarioGuardado
    })
  })
})



// ==========================================================================
// => Eliminar Usuario
// ==========================================================================
app.delete('/:id', mdwAuth.verificaToken, (req, res) => {
  var id = req.params.id
  Usuario.findOneAndRemove(id, (err, usuarioBorrado) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al borrar Usuario',
        errors: err
      })
    }
    if (!usuarioBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: 'No Existe ningun usuario con ese id',
        errors: {
          message: 'No existe ningun usuario con ese id'
        }
      })
    }
    res.status(200).json({
      ok: true,
      usuario: usuarioBorrado
    })
  })

})
module.exports = app
