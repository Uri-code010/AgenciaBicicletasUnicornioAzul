//=========================================
// SCM - PROVEEDORES
//=========================================

const API_BASE = "http://127.0.0.1:4000/api";

const tabla = document.getElementById("tablaProveedores");
const formProveedor = document.getElementById("formProveedor");
const mensajeProveedor = document.getElementById("mensajeProveedor");

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

async function cargarProveedores() {
    try {
        const respuesta = await fetch(`${API_BASE}/proveedores`, { credentials: "include" });

        if (!respuesta.ok) {
            tabla.innerHTML = `<tr><td colspan="4">No se pudieron cargar los proveedores.</td></tr>`;
            return;
        }

        const proveedores = await respuesta.json();

        if (proveedores.length === 0) {
            tabla.innerHTML = `<tr><td colspan="4">Aún no hay proveedores registrados.</td></tr>`;
            return;
        }

        tabla.innerHTML = "";
        proveedores.forEach(p => {
            tabla.innerHTML += `
                <tr>
                    <td>${p.nombre}</td>
                    <td>${p.contacto || "Sin registrar"}</td>
                    <td>${p.correo || "Sin registrar"}</td>
                    <td>${p.telefono || "Sin registrar"}</td>
                </tr>
            `;
        });

    } catch (error) {
        console.error(error);
        tabla.innerHTML = `<tr><td colspan="4">No se pudo conectar con el servidor.</td></tr>`;
    }
}

formProveedor.addEventListener("submit", async function (e) {
    e.preventDefault();

    const nombre = document.getElementById("nombreProveedor").value.trim();
    const contacto = document.getElementById("contactoProveedor").value.trim();
    const correo = document.getElementById("correoProveedor").value.trim();
    const telefono = document.getElementById("telefonoProveedor").value.trim();

    try {
        const respuesta = await fetch(`${API_BASE}/proveedores`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ nombre, contacto, correo, telefono })
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            const detalle = datos.errores ? datos.errores.map(e => e.msg).join(" ") : datos.message;
            mensajeProveedor.innerHTML = `❌ ${detalle}`;
            return;
        }

        mensajeProveedor.innerHTML = "✅ Proveedor registrado.";
        formProveedor.reset();
        cargarProveedores();

    } catch (error) {
        console.error(error);
        mensajeProveedor.innerHTML = "❌ No se pudo conectar con el servidor.";
    }
});

async function iniciar() {
    const haySesion = await verificarSesion();
    if (haySesion) cargarProveedores();
}

iniciar();