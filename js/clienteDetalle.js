//=========================================
// HISTORIAL DEL CLIENTE
//=========================================

const API_BASE = "http://127.0.0.1:4000/api";

// Tomamos el id del cliente desde la URL: clienteDetalle.html?id=1
const parametros = new URLSearchParams(window.location.search);
const clienteId = parametros.get("id");

const datosCliente = document.getElementById("datosCliente");
const lineaTiempo = document.getElementById("lineaTiempo");
const formInteraccion = document.getElementById("formInteraccion");
const mensajeInteraccion = document.getElementById("mensajeInteraccion");

async function verificarSesion() {
    try {
        const respuesta = await fetch(`${API_BASE}/auth/me`, { credentials: "include" });
        if (!respuesta.ok) {
            window.location.href = "adminLogin.html";
            return false;
        }
        return true;
    } catch (error) {
        console.error(error);
        window.location.href = "adminLogin.html";
        return false;
    }
}

async function cargarCliente() {
    try {
        const respuesta = await fetch(`${API_BASE}/clientes/${clienteId}`, { credentials: "include" });

        if (!respuesta.ok) {
            datosCliente.innerHTML = "<p>No se encontró este cliente.</p>";
            return;
        }

        const cliente = await respuesta.json();

        const estadoHTML = cliente.estado === "activo"
            ? `<span class="estadoActivo">🟢 Activo</span>`
            : `<span class="estadoInactivo">🔴 Inactivo</span>`;

        datosCliente.innerHTML = `
            <h2>${cliente.nombre}</h2>
            <p><strong>Correo:</strong> ${cliente.correo}</p>
            <p><strong>Teléfono:</strong> ${cliente.telefono || "Sin registrar"}</p>
            <p><strong>Empresa:</strong> ${cliente.empresa || "Sin registrar"}</p>
            <p><strong>Estado:</strong> ${estadoHTML}</p>
            <p><strong>Etapa CRM:</strong> ${cliente.etapa_crm || "Prospecto"}</p>
        `;

    } catch (error) {
        console.error(error);
        datosCliente.innerHTML = "<p>Error al cargar los datos del cliente.</p>";
    }
}

function formatearFecha(fechaISO) {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleString("es-MX", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit"
    });
}

const ICONOS_TIPO = {
    llamada: "📞",
    correo: "✉️",
    "reunión": "🤝"
};

async function cargarHistorial() {
    try {
        const respuesta = await fetch(`${API_BASE}/clientes/${clienteId}/interacciones`, { credentials: "include" });

        if (!respuesta.ok) {
            lineaTiempo.innerHTML = "<li>No se pudo cargar el historial.</li>";
            return;
        }

        const interacciones = await respuesta.json();

        if (interacciones.length === 0) {
            lineaTiempo.innerHTML = "<li>Este cliente todavía no tiene interacciones registradas.</li>";
            return;
        }

        lineaTiempo.innerHTML = "";

        interacciones.forEach(interaccion => {
            const icono = ICONOS_TIPO[interaccion.tipo] || "📝";

            lineaTiempo.innerHTML += `
                <li>
                    <strong>${icono} ${interaccion.tipo}</strong>
                    — ${formatearFecha(interaccion.fecha)}
                    <br>
                    ${interaccion.descripcion || "<em>Sin descripción</em>"}
                </li>
            `;
        });

    } catch (error) {
        console.error(error);
        lineaTiempo.innerHTML = "<li>Error al cargar el historial.</li>";
    }
}

formInteraccion.addEventListener("submit", async function (e) {
    e.preventDefault();

    const tipo = document.getElementById("tipoInteraccion").value;
    const descripcion = document.getElementById("descripcionInteraccion").value.trim();

    try {
        const respuesta = await fetch(`${API_BASE}/interacciones`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                cliente_id: Number(clienteId),
                tipo,
                descripcion
            })
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            const detalle = datos.errores ? datos.errores.map(e => e.msg).join(" ") : datos.message;
            mensajeInteraccion.innerHTML = `❌ ${detalle}`;
            return;
        }

        mensajeInteraccion.innerHTML = "✅ Interacción registrada.";
        formInteraccion.reset();
        cargarHistorial(); // refresca la línea de tiempo con la nueva interacción

    } catch (error) {
        console.error(error);
        mensajeInteraccion.innerHTML = "❌ No se pudo conectar con el servidor.";
    }
});

async function iniciar() {
    if (!clienteId) {
        datosCliente.innerHTML = "<p>No se especificó ningún cliente.</p>";
        return;
    }

    const haySesion = await verificarSesion();
    if (haySesion) {
        cargarCliente();
        cargarHistorial();
    }
}

iniciar();