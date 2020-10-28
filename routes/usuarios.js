/**
 * Ruta: api/usuarios
 */

const { Router, response } = require('express');
const { check } = require('express-validator');
const { getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario } = require('../controllers/usuarios');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, getUsuarios);
router.post(
  '/',
  [
    validarJWT,
    check('nombre', 'Nombre es obligatorio').not().isEmpty(),
    check('email', 'Email es obligatorio').not().isEmpty(),
    check('email', 'Debe ingresar un correo válido').isEmail(),
    check('password', 'Password es obligatorio').not().isEmpty(),
    validarCampos,
  ],
  crearUsuario
);
router.put(
  '/:id',
  [
    validarJWT,
    check('nombre', 'Nombre es obligatorio').not().isEmpty(),
    check('email', 'Email es obligatorio').not().isEmpty(),
    check('email', 'Debe ingresar un correo válido').isEmail(),
    check('role', 'Rol es obligatorio').not().isEmpty(),
    validarCampos,
  ],
  actualizarUsuario
);

router.delete('/:id', validarJWT, borrarUsuario);

module.exports = router;
