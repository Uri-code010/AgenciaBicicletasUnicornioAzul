const proveedorModel = require("../models/proveedorModel");
 
async function listar(req, res, next) {
    try {
        const proveedores = await proveedorModel.listar();
        res.json(proveedores);
    } catch (err) {
        next(err);
    }
}
 
async function crear(req, res, next) {
    try {
        const proveedor = await proveedorModel.crear(req.body);
        res.status(201).json(proveedor);
    } catch (err) {
        next(err);
    }
}
 
module.exports = { listar, crear };
 