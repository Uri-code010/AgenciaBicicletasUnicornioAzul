const express = require("express");
const router = express.Router();
const interaccionController = require("../controllers/interaccionController..js");
const { reglasInteraccion, manejarErroresValidacion } = require("../middleware/validarInteraccion");
const { requireAuth, requirePermission } = require("../middleware/auth");
router.post("/", requirePermission("interacciones:crear"), reglasInteraccion, manejarErroresValidacion, interaccionController.crear);
router.post("/solicitudes", requireAuth, interaccionController.crearSolicitud);
router.post("/contacto", interaccionController.crearContacto);
router.get("/solicitudes", requirePermission("solicitudes:ver"), interaccionController.listarSolicitudes);
router.get("/mias", requireAuth, interaccionController.misInteracciones);
 
module.exports = router;