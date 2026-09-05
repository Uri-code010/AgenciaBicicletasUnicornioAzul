//archivo que sirve para autenticar a los usarios y proteger las rutas de la API
// Protege rutas: solo deja pasar si hay una sesión activa (usuario logueado)
function requireAuth(req, res, next) {
    if (!req.session.usuario) {
        return res.status(401).json({ status: "error", message: "Debes iniciar sesión." });
    }
    next();
}

module.exports = { requireAuth };