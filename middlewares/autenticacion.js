var SEED = require('../config/config').SEED
var jwt = require('jsonwebtoken')


// ==========================================================================
// => Verificar Token por URL
// ==========================================================================
exports.verificaToken = (req, res, next) => {
  var token = req.query.token
  jwt.verify(token, SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        mensaje: 'Token incorrecto',
        errors: err
      })
    }
    req.usuario = decoded.usuario
    next()
  })
}

// ==========================================================================
// => Verificar Admin
// ==========================================================================
exports.verificaAdminRole = (req, res, next) => {

  var usuario = req.usuario
  var id = req.params.id
  if (usuario.role == 'ADMIN_ROLE' || usuario._id === id) {
    next()
    return
  } else {
    return res.status(401).json({
      ok: false,
      mensaje: 'Token incorrecto, no es administrador',
      errors: {
        message: 'No es administrador'
      }
    })
  }
}
