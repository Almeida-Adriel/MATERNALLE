const express = require('express');
const router = express.Router();
const { getAllUsuarios, createUsuario } = require('../controllers/usuarios');

router.get('/', getAllUsuarios);
router.post('/', createUsuario);

module.exports = router;