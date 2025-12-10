const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/reportesController');

// POST /reportes?tipo=sync|async
router.post('/', reportesController.generarReporte);

module.exports = router;
