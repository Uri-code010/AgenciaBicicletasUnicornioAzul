//controller es para manejar la autenticación de usuarios y la gestión de sesiones.
const usuarioModel = require("../models/usuarioModel");
const bcrypt = require("bcrypt");
const { usuarioPublico } = require("../config/permisos");
const { PERMISOS_EMPLEADO_VALIDOS } = require("../config/permisosEmpleado");
const ADMIN_PRINCIPAL = "miriam@correo.com";
//codigo para el registro de usuarios. sirve para crear un nuevo usuario en la base de datos y manejar errores como campos faltantes o correo ya existente. 
async function registro(req, res, next) {
    try {
        const { nombre, correo, password, telefono, rol } = req.body;
 
        if (!nombre || !correo || !password) {
            return res.status(400).json({ status: "error", message: "nombre, correo y password son obligatorios." });
        }
 
        const existente = await usuarioModel.buscarPorCorreo(correo);
        if (existente) {
            return res.status(409).json({ status: "error", message: "Ya existe un usuario con ese correo." });
        }
 
        const rolRegistrable = rol === "usuario" ? "usuario" : "cliente";

        // El registro público nunca puede crear cuentas administrativas.
        const usuario = await usuarioModel.crearConCliente({
            nombre,
            correo,
            password,
            telefono,
            rol: rolRegistrable
        });
        res.status(201).json(usuario);
    } catch (err) {
        next(err);
    }
}
// 
async function login(req, res, next) {
    try {
        const { correo, password } = req.body;
 
        if (!correo || !password) {
            return res.status(400).json({ status: "error", message: "correo y password son obligatorios." });
        }
 
        const usuario = await usuarioModel.buscarPorCorreo(correo);
        if (!usuario) {
            return res.status(401).json({ status: "error", message: "Correo o contraseña incorrectos." });
        }
 
        const passwordValido = await usuarioModel.verificarPassword(password, usuario.password_hash);
        if (!passwordValido) {
            return res.status(401).json({ status: "error", message: "Correo o contraseña incorrectos." });
        }
 
        // Guardamos solo lo necesario en la sesión, nunca el password_hash
        req.session.usuario = usuarioPublico(usuario);
 
        res.json({ status: "ok", usuario: req.session.usuario });
    } catch (err) {
        next(err);
    }
}
//logout sirve para cerrar la sesión del usuario y limpiar la cookie de la sesión.  
function logout(req, res, next) {
    req.session.destroy((err) => {
        if (err) return next(err);
        res.clearCookie("connect.sid");
        res.json({ status: "ok", message: "Sesión cerrada." });
    });
}
// función me (significa "yo") sirve para obtener la información del usuario actualmente logueado a partir de la sesión activa. Si no hay sesión, devuelve un error 401.
async function me(req, res, next) {
    try {
        if (!req.session.usuario) {
            return res.status(401).json({ status: "error", message: "No hay sesión activa." });
        }

        const usuario = await usuarioModel.buscarPorId(req.session.usuario.id);
        if (!usuario) {
            return req.session.destroy(() => {
                res.clearCookie("connect.sid");
                res.status(401).json({ status: "error", message: "La cuenta ya no existe." });
            });
        }

        req.session.usuario = usuarioPublico(usuario);
        res.json(req.session.usuario);
    } catch (error) {
        next(error);
    }
}

async function actualizarPerfil(req, res, next) {
    try {
        const telefono = typeof req.body?.telefono === "string" ? req.body.telefono.trim() : "";
        if (telefono.length > 30) {
            return res.status(400).json({ status: "error", message: "El teléfono no puede superar 30 caracteres." });
        }

        const usuario = await usuarioModel.actualizarTelefonoPorCorreo(req.session.usuario.correo, telefono);
        if (!usuario) {
            return res.status(404).json({ status: "error", message: "No existe un perfil de cliente asociado." });
        }

        const datosActualizados = await usuarioModel.buscarPorId(req.session.usuario.id);
        req.session.usuario = usuarioPublico(datosActualizados);
        res.json(req.session.usuario);
    } catch (error) {
        next(error);
    }
}

async function cambiarPassword(req, res, next) {
    try {
        const { passwordActual, passwordNueva, confirmarPassword } = req.body || {};
        if (!passwordActual || !passwordNueva || passwordNueva !== confirmarPassword) {
            return res.status(400).json({ status: "error", message: "Verifica la contraseña actual y la confirmación." });
        }
        if (passwordNueva.length < 8) {
            return res.status(400).json({ status: "error", message: "La nueva contraseña debe tener al menos 8 caracteres." });
        }

        const usuario = await usuarioModel.buscarPorId(req.session.usuario.id);
        const esValida = await usuarioModel.verificarPassword(passwordActual, usuario.password_hash);
        if (!esValida) {
            return res.status(401).json({ status: "error", message: "La contraseña actual no es correcta." });
        }

        const passwordHash = await bcrypt.hash(passwordNueva, 10);
        await usuarioModel.actualizarPassword(usuario.id, passwordHash);
        res.json({ status: "ok", message: "Contraseña actualizada correctamente." });
    } catch (error) {
        next(error);
    }
}

async function crearEmpleado(req, res, next) {
    try {
        if (req.session.usuario.correo.toLowerCase() !== ADMIN_PRINCIPAL) {
            return res.status(403).json({ status: "error", message: "Solo el administrador principal puede registrar empleados." });
        }

        const { nombre, correo, password, permisos, rol } = req.body || {};
        if (!nombre?.trim() || !correo?.trim() || !password) {
            return res.status(400).json({ status: "error", message: "Nombre, correo y contraseña son obligatorios." });
        }

        const existente = await usuarioModel.buscarPorCorreo(correo.trim());
        if (existente) {
            return res.status(409).json({ status: "error", message: "Ya existe un usuario con ese correo." });
        }

        const permisosSeguros = Array.isArray(permisos)
            ? permisos.filter((permiso) => PERMISOS_EMPLEADO_VALIDOS.includes(permiso))
            : [];
        const rolSeguro = rol === "admin" ? "admin" : "empleado";
        const empleado = await usuarioModel.crearEmpleado({
            nombre: nombre.trim(),
            correo: correo.trim().toLowerCase(),
            password,
            permisos: rolSeguro === "admin" ? [] : permisosSeguros,
            rol: rolSeguro
        });
        res.status(201).json(usuarioPublico(empleado));
    } catch (error) {
        next(error);
    }
}

function esAdminPrincipal(req) {
    return req.session.usuario.correo.toLowerCase() === ADMIN_PRINCIPAL;
}

async function listarEmpleados(req, res, next) {
    try {
        if (!esAdminPrincipal(req)) {
            return res.status(403).json({ status: "error", message: "Solo el administrador principal puede gestionar empleados." });
        }
        const empleados = await usuarioModel.listarEmpleados();
        res.json(empleados.map(usuarioPublico));
    } catch (error) {
        next(error);
    }
}

async function actualizarPermisosEmpleado(req, res, next) {
    try {
        if (!esAdminPrincipal(req)) {
            return res.status(403).json({ status: "error", message: "Solo el administrador principal puede gestionar empleados." });
        }
        const permisos = Array.isArray(req.body?.permisos)
            ? req.body.permisos.filter((permiso) => PERMISOS_EMPLEADO_VALIDOS.includes(permiso))
            : [];
        const empleado = await usuarioModel.actualizarPermisosEmpleado(req.params.id, permisos);
        if (!empleado) {
            return res.status(404).json({ status: "error", message: "Empleado no encontrado." });
        }
        res.json(usuarioPublico(empleado));
    } catch (error) {
        next(error);
    }
}
 
module.exports = { registro, login, logout, me, actualizarPerfil, cambiarPassword, crearEmpleado, listarEmpleados, actualizarPermisosEmpleado };
 