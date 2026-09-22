//=========================================
// DASHBOARD DE MÉTRICAS
//=========================================

const API_BASE = "http://127.0.0.1:4000/api";

const contadores = document.getElementById("contadores");
const graficaEstado = document.getElementById("graficaEstado");
const tablaRiesgo = document.getElementById("tablaRiesgo");

async function verificarSesion() {
    try {
        const respuesta = await fetch(`${API_BASE}/auth/me`, { credentials: "include" });
        if (!respuesta.ok) {
            window.location.replace("adminLogin.html");
            return false;
        }

        const usuario = await respuesta.json();
        const tienePermiso = usuario.permisos?.includes("*") || usuario.permisos?.includes("metricas:ver");
        if (!tienePermiso) {
            await fetch(`${API_BASE}/auth/logout`, { method: "POST", credentials: "include" });
            window.location.replace("adminLogin.html");
            return false;
        }

        return true;
    } catch (error) {
        console.error(error);
        window.location.href = "adminLogin.html";
        return false;
    }
}

function formatearFecha(fechaISO) {
    if (!fechaISO) return "Nunca";
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString("es-MX");
}

async function cargarMetricas() {
    try {
        const respuesta = await fetch(`${API_BASE}/metricas`, { credentials: "include" });

        if (!respuesta.ok) {
            contadores.innerHTML = "<p>No se pudieron cargar las métricas.</p>";
            return;
        }

        const datos = await respuesta.json();

        // --- Contadores ---
        const activos = datos.porEstado?.activo || 0;
        const inactivos = datos.porEstado?.inactivo || 0;

        contadores.innerHTML = `
            <div class="tarjetaContador">
                <span class="numero">${datos.total}</span>
                Total de clientes
            </div>
            <div class="tarjetaContador">
                <span class="numero">${activos}</span>
                Activos
            </div>
            <div class="tarjetaContador">
                <span class="numero">${inactivos}</span>
                Inactivos
            </div>
            <div class="tarjetaContador">
                <span class="numero">${datos.sinInteraccionReciente.length}</span>
                En riesgo
            </div>
        `;

        // --- Gráfica simple de barras (activos vs inactivos) ---
        const totalEstado = activos + inactivos || 1; // evita dividir entre 0
        const porcentajeActivo = Math.round((activos / totalEstado) * 100);
        const porcentajeInactivo = Math.round((inactivos / totalEstado) * 100);

        graficaEstado.innerHTML = `
            <div class="filaBarra">
                <span class="etiqueta">🟢 Activos</span>
                <div class="pistaBarra"><div class="barra" style="width:${porcentajeActivo}%; background:#0f766e;"></div></div>
                <span class="valorBarra">${activos} (${porcentajeActivo}%)</span>
            </div>
            <div class="filaBarra">
                <span class="etiqueta">🔴 Inactivos</span>
                <div class="pistaBarra"><div class="barra" style="width:${porcentajeInactivo}%; background:#be123c;"></div></div>
                <span class="valorBarra">${inactivos} (${porcentajeInactivo}%)</span>
            </div>
        `;

        // --- Lista de clientes en riesgo ---
        if (datos.sinInteraccionReciente.length === 0) {
            tablaRiesgo.innerHTML = `<tr><td colspan="3">Ningún cliente en riesgo por ahora 🎉</td></tr>`;
        } else {
            tablaRiesgo.innerHTML = "";
            datos.sinInteraccionReciente.forEach(cliente => {
                tablaRiesgo.innerHTML += `
                    <tr>
                        <td>${cliente.nombre}</td>
                        <td>${cliente.correo}</td>
                        <td>${formatearFecha(cliente.ultima_interaccion)}</td>
                    </tr>
                `;
            });
        }

    } catch (error) {
        console.error(error);
        contadores.innerHTML = "<p>No se pudo conectar con el servidor.</p>";
    }
}

async function iniciar() {
    document.body.classList.add("auth-pending");
    const haySesion = await verificarSesion();
    if (haySesion) {
        document.body.classList.remove("auth-pending");
        cargarMetricas();
    }
}

window.addEventListener("pageshow", iniciar);