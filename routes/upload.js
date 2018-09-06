const express = require('express')
var app = express()
const fileUpload = require('express-fileupload');
var fs = require('fs')


var Usuario = require('../models/usuario')
var Medico = require('../models/medico')
var Hospital = require('../models/hospital')


app.use(fileUpload());

app.put('/:tipo/:id', (req, res) => {

  var tipo = req.params.tipo
  var id = req.params.id

  //Tipos de collecion
  var tiposValidos = ['hospitales', 'medicos', 'usuarios']
  if (tiposValidos.indexOf(tipo) < 0) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Coleccion no es valida',
      errors: {
        message: 'Coleccion no es valida'
      }
    })
  }

  if (!req.files) {
    return res.status(400).json({
      ok: false,
      mensaje: 'No selecciono nada',
      errors: {
        message: 'Debe de seleccionar una imagen'
      }
    })
  }

  //Obtener nombre de archivo
  var archivo = req.files.imagen
  var nombreCortado = archivo.name.split('.')
  var extensionArchivo = nombreCortado[nombreCortado.length - 1]

  //Solo se aceptan estas extensiones
  var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg']
  if (extensionesValidas.indexOf(extensionArchivo) < 0) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Extension no valida',
      errors: {
        message: 'Los archivos validos son png, jpg, gif y jpeg'
      }
    })
  }

  //Nombre de archivo personalizado
  var nombreArchivo = `${id}-${new Date().getMilliseconds() }.${ extensionArchivo }`

  //Mover el archivo del temporal a una direccion en particular
  var path = `./uploads/${tipo}/${nombreArchivo}`
  archivo.mv(path, (err) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al mover Archivo',
        errors: err
      })
    }
    subirPorTipo(tipo, id, nombreArchivo, res)

  })

})

function subirPorTipo(tipo, id, nombreArchivo, res) {
  if (tipo === 'usuarios') {
    Usuario.findById(id, (err, usuario) => {
      var pathViejo = './uploads/usuarios/' + usuario.img
      //Si existe, elimina la imagen anterior
      if (fs.existsSync(pathViejo)) {
        fs.unlink(pathViejo)
      }
      usuario.img = nombreArchivo
      usuario.save((err, usuarioActualizado) => {
        return res.status(200).json({
          ok: true,
          mensaje: 'Imagen de usuario actualizada',
          'extensionArchivo': usuarioActualizado
        })
      })

    })
  }
  if (tipo === 'medicos') {
    Medico.findById(id, (err, medico) => {
      var pathViejo = './uploads/medicos/' + medico.img
      //Si existe, elimina la imagen anterior
      if (fs.existsSync(pathViejo)) {
        fs.unlink(pathViejo)
      }
      medico.img = nombreArchivo
      medico.save((err, medicoActualizado) => {
        return res.status(200).json({
          ok: true,
          mensaje: 'Imagen de medico actualizada',
          'extensionArchivo': medicoActualizado
        })
      })

    })
  }
  if (tipo === 'hopitales') {
    Hospital.findById(id, (err, hospital) => {
      var pathViejo = './uploads/usuarios/' + hospital.img
      //Si existe, elimina la imagen anterior
      if (fs.existsSync(pathViejo)) {
        fs.unlink(pathViejo)
      }
      hospital.img = nombreArchivo
      hospital.save((err, hospitalActualizado) => {
        return res.status(200).json({
          ok: true,
          mensaje: 'Imagen de hospital actualizada',
          'extensionArchivo': hospitalActualizado
        })
      })

    })
  }
}


module.exports = app
