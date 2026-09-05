function validarCliente(req, res, next) {
	const { nombre, correo, estado } = req.body || {};
	const errores = [];

	if (typeof nombre !== "string" || !nombre.trim()) {
		errores.push({ path: "nombre", msg: "El nombre es obligatorio." });
	}
	if (typeof correo !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
		errores.push({ path: "correo", msg: "El correo no es válido." });
	}
	if (estado !== undefined && !["activo", "inactivo"].includes(estado)) {
		errores.push({ path: "estado", msg: "El estado no es válido." });
	}

	if (errores.length) {
		return res.status(400).json({ errores });
	}
	next();
}

const reglasCliente = validarCliente;
const manejarErroresValidacion = (req, res, next) => next();

module.exports = { reglasCliente, manejarErroresValidacion };
