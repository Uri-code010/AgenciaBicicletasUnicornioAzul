//controller es para manejar la autenticación de usuarios y la gestión de sesiones.
const usuarioModel = require("../models/usuarioModel");
//codigo para el registro de usuarios. sirve para crear un nuevo usuario en la base de datos y manejar errores como campos faltantes o correo ya existente. 
async function registro(req, res, next) {
    try {
        const { nombre, correo, password } = req.body;
 
        if (!nombre || !correo || !password) {
            return res.status(400).json({ status: "error", message: "nombre, correo y password son obligatorios." });
        }
 
        const existente = await usuarioModel.buscarPorCorreo(correo);
        if (existente) {
            return res.status(409).json({ status: "error", message: "Ya existe un usuario con ese correo." });
        }
 
        const usuario = await usuarioModel.crear({ nombre, correo, password });
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
        req.session.usuario = {
            id: usuario.id,
            nombre: usuario.nombre,
            correo: usuario.correo,
            rol: usuario.rol
        };
 
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
function me(req, res) {
    if (!req.session.usuario) {
        return res.status(401).json({ status: "error", message: "No hay sesión activa." });
    }
    res.json(req.session.usuario);
}
 
module.exports = { registro, login, logout, me };
 