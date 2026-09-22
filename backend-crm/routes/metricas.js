const express = require("express");
const router = express.Router();
const metricaController = require("../controllers/metricaController");
const { requirePermission } = require("../middleware/auth");
 
// GET /api/metricas 
router.get("/", requirePermission("metricas:ver"), metricaController.resumen);

 
module.exports = router;
 