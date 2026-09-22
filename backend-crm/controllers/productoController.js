const productoModel = require("../models/productoModel");
 
async function listar(req, res, next) {
    try {
        const { estrategia } = req.query;
        const productos = await productoModel.listar({ estrategia });
        res.json(productos);
    } catch (err) {
        next(err);
    }
}
 
async function obtenerPorId(req, res, next) {
    try {
        const producto = await productoModel.obtenerPorId(req.params.id);
        if (!producto) {
            return res.status(404).json({ status: "error", message: "Producto no encontrado." });
        }
        res.json(producto);
    } catch (err) {
        next(err);
    }
}
 
async function crear(req, res, next) {
    try {
        const producto = await productoModel.crear(req.body);
        res.status(201).json(producto);
    } catch (err) {
        next(err);
    }
}
 
async function actualizar(req, res, next) {
    try {
        const producto = await productoModel.actualizar(req.params.id, req.body);
        if (!producto) {
            return res.status(404).json({ status: "error", message: "Producto no encontrado." });
        }
        res.json(producto);
    } catch (err) {
        next(err);
    }
}
 
async function eliminar(req, res, next) {
    try {
        const eliminado = await productoModel.eliminar(req.params.id);
        if (!eliminado) {
            return res.status(404).json({ status: "error", message: "Producto no encontrado." });
        }
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}
 
module.exports = { listar, obtenerPorId, crear, actualizar, eliminar };