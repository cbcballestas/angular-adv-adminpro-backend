/**
 * Funcionalidades módulo de usuarios
 */

const { response } = require('express');
const brcypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async (req, res) => {
  const usuarios = await Usuario.find({}, 'nombre email role google');

  res.json({
    ok: true,
    usuarios,
  });
};

const crearUsuario = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const existeEmail = await Usuario.findOne({ email: email });

    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: 'Ya existe un usuario registrado con ése correo',
      });
    }

    const usuario = new Usuario(req.body);

    // Encriptar contraseña

    const salt = brcypt.genSaltSync();
    usuario.password = brcypt.hashSync(password, salt);

    // Guardar usuario
    await usuario.save();

    const token = await generarJWT(usuario.id);

    res.json({
      ok: true,
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...Por favor contacte al Administrador',
    });
  }
};

const actualizarUsuario = async (req, res = response) => {
  // TODO: Validar token y comprobar si es el usuario correcto

  const uid = req.params.id;

  try {
    const usuarioDB = await Usuario.findById(uid);

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: 'Usuario NO existe',
      });
    }

    //* Actualizaciones
    const { password, google, email, ...campos } = req.body;

    if (usuarioDB.email !== email) {
      const existeEmail = await Usuario.findOne({ email });

      if (existeEmail) {
        return res.status(400).json({
          ok: false,
          msg: 'YA existe un usuario con ése Email',
        });
      }
    }

    campos.email = email;
    const usuarioAct = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

    res.json({
      ok: true,
      usuario: usuarioAct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado... Por favor contacte al administrador',
    });
  }
};

const borrarUsuario = async (req, res = response) => {
  const uid = req.params.id;

  try {
    const usuarioDB = await Usuario.findById(uid);

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: 'El usuario a borrar no existe',
      });
    }

    await Usuario.findByIdAndDelete(uid);

    res.json({
      ok: true,
      msg: 'Usuario eliminado éxitosamente',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...Por favor contacte al administrador',
    });
  }
};

module.exports = {
  getUsuarios,
  crearUsuario,
  actualizarUsuario,
  borrarUsuario,
};
