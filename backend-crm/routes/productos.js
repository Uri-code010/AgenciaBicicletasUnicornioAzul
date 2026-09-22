const express = require("express");
const router = express.Router();
const productoController = require("../controllers/productoController");
const { reglasProducto, manejarErroresValidacion } = require("../middleware/validarProducto");
const { requirePermission } = require("../middleware/auth");
 
router.get("/", requirePermission("productos:ver"), productoController.listar);
router.get("/:id", requirePermission("productos:ver"), productoController.obtenerPorId);
router.post("/", requirePermission("productos:editar"), reglasProducto, manejarErroresValidacion, productoController.crear);
router.put("/:id", requirePermission("productos:editar"), reglasProducto, manejarErroresValidacion, productoController.actualizar);
router.delete("/:id", requirePermission("productos:editar"), productoController.eliminar);
 
module.exports = router;