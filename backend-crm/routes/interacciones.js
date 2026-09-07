const express = require("express");
const router = express.Router();
const interaccionController = require("../controllers/interaccionController..js");
const { reglasInteraccion, manejarErroresValidacion } = require("../middleware/validarInteraccion");
const { requireAuth } = require("../middleware/auth");
router.post("/", reglasInteraccion, manejarErroresValidacion, interaccionController.crear, requireAuth);

module.exports = router;