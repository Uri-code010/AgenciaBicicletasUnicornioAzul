//=========================================
// CLIENTES ADMIN
//=========================================

const API_CLIENTES = "http://127.0.0.1:4000/api/clientes";
const API_CLIENTES_AUTH = "http://127.0.0.1:4000/api/auth";

const tabla = document.getElementById("tablaClientes");
const filtroEtapa = document.getElementById("filtroEtapa");
const infoUsuario = document.getElementById("infoUsuario");
const mensajeClientes = document.getElementById("mensajeClientes");
const listaSolicitudesAdmin = document.getElementById("listaSolicitudesAdmin");

let listaClientes = [];
let usuarioActual = null; // guardamos aquí quién tiene la sesión abierta (con su rol)

const ETAPA_COLORES = {
    "Prospecto": "#607d8b",
    "Activo": "#2e7d32",
    "Frecuente": "#8e24aa",
    "Inactivo": "#c62828"
};

const ETAPAS = ["Prospecto", "Activo", "Frecuente", "Inactivo"];

async function verificarSesion() {
    try {
        const respuesta = await fetch(`${API_CLIENTES_AUTH}/me`, { credentials: "include" });
        if (!respuesta.ok) {
            window.location.href = "adminLogin.html";
            return false;
        }

        usuarioActual = await respuesta.json();

        if (!usuarioActual.permisos?.includes("*") && !usuarioActual.permisos?.includes("clientes:ver")) {
            await fetch(`${API_CLIENTES_AUTH}/logout`, { method: "POST", credentials: "include" });
            window.location.href = "login.html";
            return false;
        }

        if (infoUsuario) {
            infoUsuario.innerHTML = `
                ${usuarioActual.nombre} (${usuarioActual.rol})
                — <a href="#" id="linkLogout">Cerrar sesión</a>
            `;
            document.getElementById("linkLogout").addEventListener("click", async (e) => {
                e.preventDefault();
                await fetch(`${API_CLIENTES_AUTH}/logout`, { method: "POST", credentials: "include" });
                window.location.href = "adminLogin.html";
            });
        }

        return true;
    } catch (error) {
        console.error(error);
        window.location.href = "adminLogin.html";
        return false;
    }
}

function esAdmin() {
    return usuarioActual && (usuarioActual.permisos?.includes("*") || usuarioActual.permisos?.includes("clientes:editar"));
}

function mostrarMensajePagina(mensaje, tipo = "exito") {
    if (!mensajeClientes) return;

    mensajeClientes.textContent = mensaje;
    mensajeClientes.className = `mensajeClientes visible ${tipo}`;
}

function renderizarTabla(clientes) {

    tabla.innerHTML = "";

    const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

    if (clientes.length === 0) {
        tabla.innerHTML = `<tr><td colspan="8">No hay clientes en esta etapa.</td></tr>`;
        return;
    }

    clientes.forEach(cliente => {

        const pedidosCliente = pedidos.filter(pedido =>
            (pedido.correo || "").toLowerCase() === (cliente.correo || "").toLowerCase()
        );
        const ultimaCompra = pedidosCliente[pedidosCliente.length - 1];

        const estadoHTML = cliente.estado === "activo"
            ? `<span class="estadoActivo">🟢 Activo</span>`
            : `<span class="estadoInactivo">🔴 Inactivo</span>`;

        const etapaActual = cliente.etapa_crm || "Prospecto";
        const colorEtapa = ETAPA_COLORES[etapaActual] || "#607d8b";

        const opcionesEtapa = ETAPAS.map(etapa =>
            `<option value="${etapa}" ${etapa === etapaActual ? "selected" : ""}>${etapa}</option>`
        ).join("");

        // El botón de eliminar solo se dibuja si el usuario es admin
        const botonEliminar = esAdmin()
            ? `<button class="btnEliminar" data-id="${cliente.id}">🗑️ Eliminar</button>`
            : `<span style="color:#999;">Sin permiso</span>`;

        tabla.innerHTML += `

        <tr>

            <td>${cliente.nombre}</td>

            <td>${cliente.correo}</td>

            <td>${cliente.telefono || "Sin registrar"}</td>

            <td>
                ${pedidosCliente.length}
                ${ultimaCompra ? `<br><small>${ultimaCompra.fecha || "Última compra"}</small>` : ""}
            </td>

            <td>${estadoHTML}</td>

            <td>
                <span style="background:${colorEtapa}; color:white; padding:2px 10px; border-radius:12px; font-size:0.85em;">
                    ${etapaActual}
                </span>
                <br>
                <select class="selectEtapa" data-id="${cliente.id}" ${esAdmin() ? "" : "disabled"}>
                    ${opcionesEtapa}
                </select>
            </td>

            <td>
                <a href="clienteDetalle.html?id=${cliente.id}">Ver historial</a>
            </td>

            <td>
                ${botonEliminar}
            </td>

        </tr>

        `;

    });

    document.querySelectorAll(".selectEtapa").forEach(select => {
        select.addEventListener("change", cambiarEtapa);
    });

    document.querySelectorAll(".btnEliminar").forEach(boton => {
        boton.addEventListener("click", eliminarCliente);
    });

}

async function cambiarEtapa(e) {
    const id = e.target.dataset.id;
    const nuevaEtapa = e.target.value;

    try {
        const respuesta = await fetch(`${API_CLIENTES}/${id}/etapa`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ etapa_crm: nuevaEtapa })
        });

        if (!respuesta.ok) {
            alert("No se pudo actualizar la etapa del cliente.");
            return;
        }

        const clienteActualizado = await respuesta.json();
        listaClientes = listaClientes.map(c => c.id === clienteActualizado.id ? clienteActualizado : c);
        aplicarFiltro();

    } catch (error) {
        console.error(error);
        alert("No se pudo conectar con el servidor.");
    }
}

async function eliminarCliente(e) {
    const id = e.target.dataset.id;

    const confirmar = confirm("¿Seguro que quieres eliminar este cliente? Esta acción no se puede deshacer.");
    if (!confirmar) return;

    try {
        const respuesta = await fetch(`${API_CLIENTES}/${id}`, {
            method: "DELETE",
            credentials: "include"
        });

        if (respuesta.status === 403) {
            mostrarMensajePagina("No tienes permiso de administrador para eliminar clientes.", "error");
            return;
        }

        if (!respuesta.ok && respuesta.status !== 204) {
            mostrarMensajePagina("No se pudo eliminar el cliente.", "error");
            return;
        }

        const clienteEliminado = listaClientes.find(c => c.id == id);
        const correoEliminado = (clienteEliminado?.correo || "").toLowerCase();
        const usuarios = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];
        const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

        localStorage.setItem("usuariosRegistrados", JSON.stringify(
            usuarios.filter(usuario => (usuario.correo || "").toLowerCase() !== correoEliminado)
        ));
        localStorage.setItem("pedidos", JSON.stringify(
            pedidos.filter(pedido => (pedido.correo || "").toLowerCase() !== correoEliminado)
        ));

        listaClientes = listaClientes.filter(c => c.id != id);
        aplicarFiltro();
        mostrarMensajePagina("Cliente eliminado correctamente.");

    } catch (error) {
        console.error(error);
        mostrarMensajePagina("No se pudo conectar con el servidor.", "error");
    }
}

function aplicarFiltro() {
    const valor = filtroEtapa ? filtroEtapa.value : "todas";

    if (!valor || valor === "todas") {
        renderizarTabla(listaClientes);
    } else {
        renderizarTabla(listaClientes.filter(c => (c.etapa_crm || "Prospecto") === valor));
    }
}

async function cargarClientes() {

    try {

        const usuariosLocales = typeof obtenerUsuariosRegistrados === "function"
            ? obtenerUsuariosRegistrados()
            : [];

        const usuariosParaSincronizar = usuariosLocales
            .filter(usuario => usuario.rol !== "admin" && usuario.nombre && usuario.correo)
            .map(usuario => ({
                nombre: usuario.nombre,
                correo: usuario.correo,
                telefono: usuario.telefono
            }));

        if (usuariosParaSincronizar.length > 0 && esAdmin()) {
            const sincronizacion = await fetch(`${API_CLIENTES}/sincronizar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(usuariosParaSincronizar)
            });

            if (!sincronizacion.ok) {
                throw new Error(`No se pudieron sincronizar los usuarios (${sincronizacion.status}).`);
            }
        }

        const respuesta = await fetch(API_CLIENTES, { credentials: "include" });

        if (respuesta.status === 401) {
            window.location.href = "adminLogin.html";
            return;
        }

        if (!respuesta.ok) {
            throw new Error("No se pudo obtener la lista de clientes.");
        }

        listaClientes = await respuesta.json();
        renderizarTabla(listaClientes);

    } catch (error) {

        console.error(error);

        tabla.innerHTML = `
            <tr>
                <td colspan="8">
                    No se pudieron cargar los clientes. Verifica que el backend esté corriendo (npm start).
                </td>
            </tr>
        `;

    }

}

async function cargarSolicitudesAdmin() {
    if (!listaSolicitudesAdmin) return;
    try {
        const respuesta = await fetch("http://127.0.0.1:4000/api/interacciones/solicitudes", { credentials: "include" });
        if (!respuesta.ok) {
            listaSolicitudesAdmin.textContent = "No se pudieron cargar las consultas.";
            return;
        }
        const solicitudes = await respuesta.json();
        listaSolicitudesAdmin.innerHTML = solicitudes.length
            ? solicitudes.map((solicitud) => `
                <article class="solicitudAdmin">
                    <span class="tipoSolicitud">${solicitud.tipo === "contacto" ? "Contacto" : "Petición"}</span>
                    <strong>${solicitud.cliente_nombre}</strong> (${solicitud.cliente_correo})
                    <time datetime="${solicitud.fecha}">${new Date(solicitud.fecha).toLocaleString("es-MX")}</time>
                    <p>${solicitud.descripcion}</p>
                </article>
            `).join("")
            : "<p>No hay consultas pendientes.</p>";
    } catch (error) {
        console.error(error);
        listaSolicitudesAdmin.textContent = "No se pudo conectar con el servidor.";
    }
}

async function iniciar() {
    const haySesion = await verificarSesion();
    if (haySesion) {
        cargarClientes();
        cargarSolicitudesAdmin();
        window.setInterval(cargarSolicitudesAdmin, 30000);
    }
}

if (filtroEtapa) {
    filtroEtapa.addEventListener("change", aplicarFiltro);
}

iniciar();


//=========================================
// BUSCADOR
//=========================================

document
.getElementById("buscarCliente")
.addEventListener("keyup",function(){

    const texto =
    this.value.toLowerCase();

    const filas =
    document.querySelectorAll("#tablaClientes tr");

    filas.forEach(fila=>{

        if(
            fila.innerText
            .toLowerCase()
            .includes(texto)
        ){
            fila.style.display="";
        }
        else{
            fila.style.display="none";
        }

    });

}
);