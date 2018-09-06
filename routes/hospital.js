const express = require('express')
var mdwAuth = require('../middlewares/autenticacion')

var app = express()

var Hospital = require('../models/hospital')
// ==========================================================================
// => Obtener todos los hospitales
// ==========================================================================
app.get('/', (req, res) => {
  var desde = req.query.desde || 0
  desde = Number(desde)
  Hospital.find({})
    .skip(desde)
    .limit(5)
    .populate('usuario', 'nombre email')
    .exec((err, hospitales) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error cargando hospitales',
          errors: err
        })
      }
      Hospital.count({}, (err, conteo) => {
        res.status(200).json({
          ok: true,
          hospitales: hospitales,
          total: conteo
        })
      })
    })
})

// ==========================================================================
// => Actualizar Hospital
// ==========================================================================
app.put('/:id', mdwAuth.verificaToken, (req, res) => {
  var id = req.params.id
  var body = req.body
  Hospital.findById(id, (err, hospital) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al buscar hospital',
        errors: err
      })
    }
    if (!hospital) {
      return res.status(400).json({
        ok: false,
        mensaje: 'El hospital con el id: ' + id + ' no existe',
        errors: {
          message: 'No existe un hospital con ese ID'
        }
      })
    }
    hospital.nombre = body.nombre
    //hospital.img = body.img
    hospital.usuario = req.usuario._id
    hospital.save((err, hospitalGuardado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Error al actualizar hospital',
          errors: err
        })
      }
      res.status(200).json({
        ok: true,
        hospital: hospitalGuardado
      })
    })
  })
})
// ==========================================================================
// => Crear un nuevo Hospital
// ==========================================================================
app.post('/', mdwAuth.verificaToken, (req, res) => {

  var body = req.body
  var hospital = new Hospital({
    nombre: body.nombre,
    //email: body.img,
    usuario: req.usuario._id
  })
  hospital.save((err, hospitalGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al crear Hospital',
        errors: err
      })
    }
    res.status(201).json({
      ok: true,
      hospital: hospitalGuardado
    })
  })
})
// ==========================================================================
// => Eliminar Hospital
// ==========================================================================
app.delete('/:id', mdwAuth.verificaToken, (req, res) => {
  var id = req.params.id
  Hospital.findOneAndRemove(id, (err, hospitalBorrado) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al borrar Hospital',
        errors: err
      })
    }
    if (!hospitalBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: 'No Existe ningun hospital con ese id',
        errors: {
          message: 'No existe ningun hospital con ese id'
        }
      })
    }
    res.status(200).json({
      ok: true,
      usuario: hospitalBorrado
    })
  })
})
module.exports = app
