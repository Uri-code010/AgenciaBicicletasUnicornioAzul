const interaccionModel = require("../models/interaccionModel");
const clienteModel = require("../models/clienteModel");
 
async function crear(req, res, next) {
    try {
        const cliente = await clienteModel.obtenerPorId(req.body.cliente_id);
        if (!cliente) {
            return res.status(404).json({ status: "error", message: "El cliente indicado no existe." });
        }
 
        const interaccion = await interaccionModel.crear(req.body);
        res.status(201).json(interaccion);
    } catch (err) {
        next(err);
    }
}
 
async function listarPorCliente(req, res, next) {
    try {
        const cliente = await clienteModel.obtenerPorId(req.params.id);
        if (!cliente) {
            return res.status(404).json({ status: "error", message: "El cliente indicado no existe." });
        }
 
        const interacciones = await interaccionModel.listarPorCliente(req.params.id);
        res.json(interacciones);
    } catch (err) {
        next(err);
    }
}
 
module.exports = { crear, listarPorCliente };
 