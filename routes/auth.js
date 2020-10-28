/**
 * Ruta: /api/login
 */

const { Router } = require('express');
const { check } = require('express-validator');
const { login } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post(
  '/',
  [
    check('email', 'El email es obligatorio').not().isEmpty(),
    check('email', 'Debe ingresar un email válido').isEmail(),
    check('password', 'El email es obligatorio').not().isEmpty(),
    validarCampos,
  ],
  login
);

module.exports = router;
