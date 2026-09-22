const { PERMISOS_EMPLEADO_VALIDOS } = require("./permisosEmpleado");

function obtenerPermisos(usuario) {
    if (usuario.rol === "admin") {
        return ["*"];
    }

    if (usuario.rol === "empleado") {
        let permisos = usuario.permisos;
        if (typeof permisos === "string") {
            try {
                permisos = JSON.parse(permisos || "[]");
            } catch (error) {
                permisos = [];
            }
        }
        return Array.isArray(permisos)
            ? permisos.filter((permiso) => PERMISOS_EMPLEADO_VALIDOS.includes(permiso))
            : [];
    }

    return [];
}

function tienePermiso(usuario, permiso) {
    const permisos = obtenerPermisos(usuario);
    return permisos.includes("*") || permisos.includes(permiso);
}

function usuarioPublico(usuario) {
    const esEmpleado = usuario.rol === "empleado";
    const rol = esEmpleado ? "empleado" : usuario.rol;

    return {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        telefono: usuario.telefono || "",
        rol,
        permisos: esEmpleado
            ? obtenerPermisos({ ...usuario, rol, permisos: usuario.permisos || PERMISOS_EMPLEADO_VALIDOS })
            : obtenerPermisos({ ...usuario, rol })
    };
}

module.exports = { obtenerPermisos, tienePermiso, usuarioPublico };