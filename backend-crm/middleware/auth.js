//archivo que sirve para autenticar a los usarios y proteger las rutas de la API
// Protege rutas: solo deja pasar si hay una sesión activa (usuario logueado)
const usuarioModel = require("../models/usuarioModel");
const { tienePermiso, usuarioPublico } = require("../config/permisos");

async function validarSesion(req, res) {
    if (!req.session.usuario) {
        res.status(401).json({ status: "error", message: "Debes iniciar sesión." });
        return false;
    }

    const usuario = await usuarioModel.buscarPorId(req.session.usuario.id);
    if (!usuario) {
        req.session.destroy(() => {});
        res.clearCookie("connect.sid");
        res.status(401).json({ status: "error", message: "La cuenta ya no existe." });
        return false;
    }

    req.session.usuario = usuarioPublico(usuario);
    return true;
}

async function requireAuth(req, res, next) {
    try {
        if (await validarSesion(req, res)) next();
    } catch (error) {
        next(error);
    }
}

function requireRole(...rolesPermitidos) {
    return async (req, res, next) => {
        try {
            if (!await validarSesion(req, res)) return;
            if (!rolesPermitidos.includes(req.session.usuario.rol)) {
                return res.status(403).json({ status: "error", message: "No tienes permiso para hacer esto." });
            }
            next();
        } catch (error) {
            next(error);
        }
    };
}

function requirePermission(...permisosPermitidos) {
    return async (req, res, next) => {
        try {
            if (!await validarSesion(req, res)) return;
            if (!permisosPermitidos.some((permiso) => tienePermiso(req.session.usuario, permiso))) {
                return res.status(403).json({ status: "error", message: "No tienes permiso para hacer esto." });
            }
            next();
        } catch (error) {
            next(error);
        }
    };
}

module.exports = { requireAuth, requireRole, requirePermission };