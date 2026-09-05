const express = require("express");
const router = express.Router();
const interaccionController = require("../controllers/interaccionController..js");
const { reglasInteraccion, manejarErroresValidacion } = require("../middleware/validarInteraccion");

router.post("/", reglasInteraccion, manejarErroresValidacion, interaccionController.crear);

module.exports = router;