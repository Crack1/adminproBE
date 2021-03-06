const express = require('express')
var mdwAuth = require('../middlewares/autenticacion')

var app = express()

var Medico = require('../models/medico')
    // ==========================================================================
    // => Obtener todos los medicos
    // ==========================================================================
app.get('/', (req, res) => {
    var desde = req.query.desde || 0
    desde = Number(desde)
    Medico.find({})
        .skip(desde)
        .limit(5)
        .populate(
            'usuario', 'nombre'
        )
        .populate('hospital')
        .exec((err, medicos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando medicos',
                    errors: err
                })
            }
            Medico.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    medicos: medicos,
                    total: conteo
                })
            })
        })
})

// ==========================================================================
// => Actualizar Medico
// ==========================================================================
app.put('/:id', mdwAuth.verificaToken, (req, res) => {
        var id = req.params.id
        var body = req.body
        Medico.findById(id, (err, medico) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar medico',
                    errors: err
                })
            }
            if (!medico) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El medico con el id: ' + id + ' no existe',
                    errors: {
                        message: 'No existe un medico con ese ID'
                    }
                })
            }
            medico.nombre = body.nombre
                //medico.img = body.img
            medico.usuario = req.usuario._id
            medico.hospital = body.hospital
            medico.save((err, medicoGuardado) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al actualizar medico',
                        errors: err
                    })
                }
                res.status(200).json({
                    ok: true,
                    medico: medicoGuardado
                })
            })
        })
    })
    // ==========================================================================
    // => Crear un nuevo Medico
    // ==========================================================================
app.post('/', mdwAuth.verificaToken, (req, res) => {

    var body = req.body
    var medico = new Medico({
        nombre: body.nombre,
        //img: body.img,
        usuario: req.usuario._id,
        hospital: body.hospital
    })
    medico.save((err, medicoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear Medico',
                errors: err
            })
        }
        res.status(201).json({
            ok: true,
            medico: medicoGuardado
        })
    })
})

// ==========================================================================
// => Eliminar Medico
// ==========================================================================
app.delete('/:id', mdwAuth.verificaToken, (req, res) => {
    var id = req.params.id
    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar Medico',
                errors: err
            })
        }
        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No Existe ningun medico con ese id',
                errors: {
                    message: 'No existe ningun medico con ese id'
                }
            })
        }
        res.status(200).json({
            ok: true,
            usuario: medicoBorrado
        })
    })
})

// ==========================================
// Obtener Hospital por ID
// ==========================================
app.get('/:id', (req, res) => {
    var id = req.params.id;
    Medico.findById(id)
        .populate('usuario', 'nombre email img')
        .populate('hospital')
        .exec((err, medico) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar medico',
                    errors: err
                });
            }
            if (!medico) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El medico con el id ' + id + ' no existe ',
                    errors: {
                        message: 'No existe un medico con ese ID '
                    }
                });
            }
            res.status(200).json({
                ok: true,
                medico
            });
        })
})
module.exports = app