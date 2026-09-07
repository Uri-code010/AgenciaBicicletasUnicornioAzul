const interaccionModel = require("../models/interaccionModel");
const clienteModel = require("../models/clienteModel");

async function crear(req, res, next) {
    try {
        const cliente = await clienteModel.obtenerPorId(req.body.cliente_id);
        if (!cliente) {
            return res.status(404).json({ status: "error", message: "El cliente indicado no existe." });
        }

        // El usuario responsable es quien tiene la sesión activa, no un dato que mande el front
        const datos = {
            ...req.body,
            usuario_id: req.session.usuario ? req.session.usuario.id : null
        };

        const interaccion = await interaccionModel.crear(datos);
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