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

// GET /api/interacciones/mias — actividad del usuario con sesión activa
async function misInteracciones(req, res, next) {
    try {
        const interacciones = await interaccionModel.listarPorUsuario(req.session.usuario.id);
        res.json(interacciones);
    } catch (err) {
        next(err);
    }
}

async function crearSolicitud(req, res, next) {
    try {
        const descripcion = typeof req.body?.descripcion === "string"
            ? req.body.descripcion.trim()
            : "";
        if (!descripcion || descripcion.length > 2000) {
            return res.status(400).json({ status: "error", message: "Escribe una consulta de hasta 2000 caracteres." });
        }

        const cliente = await clienteModel.obtenerPorCorreo(req.session.usuario.correo);
        if (!cliente) {
            return res.status(404).json({ status: "error", message: "No encontramos tu perfil de cliente." });
        }

        const solicitud = await interaccionModel.crear({
            cliente_id: cliente.id,
            tipo: "petición",
            descripcion,
            usuario_id: req.session.usuario.id
        });
        res.status(201).json(solicitud);
    } catch (err) {
        next(err);
    }
}

async function listarSolicitudes(req, res, next) {
    try {
        res.json(await interaccionModel.listarSolicitudes());
    } catch (err) {
        next(err);
    }
}

async function crearContacto(req, res, next) {
    try {
        const { nombre, correo, telefono, mensaje } = req.body || {};
        if (!nombre?.trim() || !correo?.trim() || !mensaje?.trim()) {
            return res.status(400).json({ status: "error", message: "Nombre, correo y mensaje son obligatorios." });
        }
        if (mensaje.trim().length > 2000) {
            return res.status(400).json({ status: "error", message: "El mensaje no puede superar 2000 caracteres." });
        }

        const cliente = await clienteModel.obtenerPorCorreo(correo.trim());
        const contacto = await interaccionModel.crearContacto({
            nombre: nombre.trim(),
            correo: correo.trim().toLowerCase(),
            telefono: telefono?.trim(),
            descripcion: mensaje.trim(),
            cliente_id: cliente?.id,
            usuario_id: req.session?.usuario?.id
        });
        res.status(201).json(contacto);
    } catch (err) {
        next(err);
    }
}
 

module.exports = { crear, listarPorCliente, misInteracciones, crearSolicitud, listarSolicitudes, crearContacto };