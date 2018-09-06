const express = require('express')
var app = express()

var Hospital = require('../models/hospital')
var Usuario = require('../models/usuario')
var Medico = require('../models/medico')




app.get('/todo/:busqueda', (req, res) => {

  var busqueda = req.params.busqueda
  var regex = new RegExp(busqueda, 'i')

  Promise.all([buscarHospitales(regex), buscarMedicos(regex), buscarUsuarios(regex)])
    .then(respuestas => {
      res.status(200).json({
        ok: true,
        hospitales: respuestas[0],
        medicos: respuestas[1],
        usuarios: respuestas[2],
        mensaje: 'Peticion realizada correctamente'
      })
    })
})

app.get('/coleccion/:tabla/:busqueda', (req, res) => {
  var tabla = req.params.tabla
  var busqueda = req.params.busqueda
  var regex = new RegExp(busqueda, 'i')

  if (tabla === 'hospital') {
    buscarHospitales(regex).then((hospitales) => {
      res.status(200).json({
        ok: true,
        hospitales,
        mensaje: 'Peticion realizada correctamente'
      })
    })
  } else if (tabla === 'medico') {
    buscarMedicos(regex).then((medicos) => {
      res.status(200).json({
        ok: true,
        medicos,
        mensaje: 'Peticion realizada correctamente'
      })
    })
  } else {
    buscarUsuarios(regex).then((usuarios) => {
      res.status(200).json({
        ok: true,
        usuarios,
        mensaje: 'Peticion realizada correctamente'
      })
    })
  }




})


function buscarHospitales(regex) {
  return new Promise((resolve, reject) => {
    Hospital.find({
        nombre: regex
      })
      .populate('usuario', 'nombre email')
      .exec((err, hospitales) => {
        if (err) {
          reject('Error al cargar Hospitales')
        }
        resolve(hospitales)
      })
  })
}

function buscarMedicos(regex) {
  return new Promise((resolve, reject) => {
    Medico.find({
        nombre: regex
      })
      .populate('usuario', 'nombre email')
      .populate('hospital')
      .exec((err, medicos) => {
        if (err) {
          reject('Error al cargar medicos')
        }
        resolve(medicos)
      })
  })
}

function buscarUsuarios(regex) {
  return new Promise((resolve, reject) => {
    Usuario.find({}, 'nombre email role')
      .or([{
        nombre: regex
      }, {
        email: regex
      }])
      .exec(
        (err, usuarios) => {
          if (err) {
            reject('Error al cargar usuarios')
          }
          resolve(usuarios)
        })
  })
}


module.exports = app


/* 

Mi solucion
async function terminos(busqueda) {
  var resHospital, resUsuario, resMedicos
  await Hospital.find({
    nombre: regex
  }, (err, hospitales) => {
    resHospital = hospitales
  })
  await Usuario.find({
    nombre: regex
  }, (err, usuarios) => {
    resUsuario = usuarios
  })
  await Medico.find({
    nombre: regex
  }, (err, medicos) => {
    resMedicos = medicos
  })

  await res.status(200).json({
    ok: true,
    resHospital,
    resUsuario,
    resMedicos,
    mensaje: 'Peticion realizada correctamente'
  })
}

terminos(busqueda) */
