//=========================================
// MI ACTIVIDAD
//=========================================

const API_BASE = "http://127.0.0.1:4000/api";

const infoUsuarioActividad = document.getElementById("infoUsuarioActividad");
const listaMiActividad = document.getElementById("listaMiActividad");

const ICONOS_TIPO = {
    llamada: "📞",
    correo: "✉️",
    "reunión": "🤝"
};

function formatearFecha(fechaISO) {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleString("es-MX", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit"
    });
}

async function verificarSesion() {
    try {
        const respuesta = await fetch(`${API_BASE}/auth/me`, { credentials: "include" });
        if (!respuesta.ok) {
            window.location.href = "adminLogin.html";
            return null;
        }
        return await respuesta.json();
    } catch (error) {
        console.error(error);
        window.location.href = "adminLogin.html";
        return null;
    }
}

async function cargarMiActividad() {
    try {
        const respuesta = await fetch(`${API_BASE}/interacciones/mias`, { credentials: "include" });

        if (!respuesta.ok) {
            listaMiActividad.innerHTML = "<li>No se pudo cargar tu actividad.</li>";
            return;
        }

        const interacciones = await respuesta.json();

        if (interacciones.length === 0) {
            listaMiActividad.innerHTML = "<li>Todavía no has registrado ninguna interacción.</li>";
            return;
        }

        listaMiActividad.innerHTML = "";

        interacciones.forEach(item => {
            const icono = ICONOS_TIPO[item.tipo] || "📝";

            listaMiActividad.innerHTML += `
                <li>
                    <strong>${icono} ${item.tipo}</strong> con
                    <a href="clienteDetalle.html?id=${item.cliente_id}">${item.cliente_nombre}</a>
                    — ${formatearFecha(item.fecha)}
                    <br>
                    ${item.descripcion || "<em>Sin descripción</em>"}
                </li>
            `;
        });

    } catch (error) {
        console.error(error);
        listaMiActividad.innerHTML = "<li>No se pudo conectar con el servidor.</li>";
    }
}

async function iniciar() {
    const usuario = await verificarSesion();
    if (!usuario) return;

    infoUsuarioActividad.innerHTML = `Sesión activa: <strong>${usuario.nombre}</strong> (${usuario.rol})`;
    cargarMiActividad();
}

iniciar();