const express = require("express");
const router = express.Router();
const metricaController = require("../controllers/metricaController");
 
// GET /api/metricas 
router.get("/", metricaController.resumen);

 
module.exports = router;
 