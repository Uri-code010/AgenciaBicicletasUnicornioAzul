const express = require("express");
const router = express.Router();
const proveedorController = require("../controllers/proveedorController");
const { reglasProveedor, manejarErroresValidacion } = require("../middleware/validarProveedor");
const { requirePermission } = require("../middleware/auth");
 
router.get("/", requirePermission("proveedores:ver"), proveedorController.listar);
router.post("/", requirePermission("proveedores:editar"), reglasProveedor, manejarErroresValidacion, proveedorController.crear);
 
module.exports = router;