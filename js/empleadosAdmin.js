const API_EMPLEADOS = "http://127.0.0.1:4000/api/auth/empleados";
const PERMISOS_EMPLEADO = [
    ["dashboard:ver", "Dashboard"],
    ["clientes:ver", "Consultar clientes"],
    ["clientes:editar", "Editar clientes"],
    ["metricas:ver", "Métricas"],
    ["solicitudes:ver", "Consultas de clientes"],
    ["interacciones:crear", "Registrar interacciones"],
    ["productos:ver", "Ver productos"],
    ["productos:editar", "Editar productos"],
    ["pedidos:ver", "Ver pedidos"],
    ["pedidos:editar", "Editar pedidos"],
    ["promociones:ver", "Ver promociones"],
    ["promociones:editar", "Editar promociones"],
    ["reportes:ver", "Ver reportes"]
];

document.addEventListener("DOMContentLoaded", async () => {
    const seccion = document.getElementById("gestionEmpleados");
    const formulario = document.getElementById("formEmpleado");
    const mensaje = document.getElementById("mensajeEmpleado");
    if (!seccion || !formulario || !mensaje) return;

    try {
        const respuesta = await fetch("http://127.0.0.1:4000/api/auth/me", { credentials: "include" });
        const usuario = await respuesta.json();
        if (respuesta.ok && usuario.correo?.toLowerCase() === "miriam@correo.com") {
            seccion.hidden = false;
            cargarEmpleados();
        }
    } catch (error) {
        console.error(error);
    }

    formulario.addEventListener("submit", async (event) => {
        event.preventDefault();
        const permisos = [...document.querySelectorAll("input[name='permisoEmpleado']:checked")]
            .map((campo) => campo.value);

        try {
            const respuesta = await fetch(API_EMPLEADOS, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    nombre: document.getElementById("nombreEmpleado").value.trim(),
                    correo: document.getElementById("correoEmpleado").value.trim(),
                    password: document.getElementById("passwordEmpleado").value,
                    rol: document.getElementById("rolEmpleado").value,
                    permisos
                })
            });
            const datos = await respuesta.json();
            mensaje.textContent = respuesta.ok
                ? `Empleado creado: ${datos.correo}`
                : (datos.message || "No se pudo crear el empleado.");
            if (respuesta.ok) formulario.reset();
        } catch (error) {
            console.error(error);
            mensaje.textContent = "No se pudo conectar con el servidor.";
        }
    });
});

async function cargarEmpleados() {
    const contenedor = document.getElementById("listaEmpleados");
    if (!contenedor) return;
    const respuesta = await fetch(API_EMPLEADOS, { credentials: "include" });
    if (!respuesta.ok) {
        contenedor.textContent = "No se pudieron cargar los empleados.";
        return;
    }
    const empleados = await respuesta.json();
    contenedor.innerHTML = empleados.length
        ? empleados.map((empleado) => `
            <article class="empleadoPermisos" data-id="${empleado.id}">
                <strong>${empleado.nombre}</strong> <span>${empleado.correo}</span>
                <div>${PERMISOS_EMPLEADO.map(([valor, etiqueta]) => `
                    <label><input type="checkbox" data-permiso="${valor}" ${empleado.permisos?.includes(valor) ? "checked" : ""}> ${etiqueta}</label>
                `).join("")}</div>
                <button type="button" class="guardarPermisosEmpleado">Guardar permisos</button>
                <p class="mensajePermisos" role="status"></p>
            </article>
        `).join("")
        : "<p>No hay empleados registrados.</p>";

    contenedor.querySelectorAll(".guardarPermisosEmpleado").forEach((boton) => {
        boton.addEventListener("click", async () => {
            const tarjeta = boton.closest(".empleadoPermisos");
            const permisos = [...tarjeta.querySelectorAll("input[data-permiso]:checked")]
                .map((campo) => campo.dataset.permiso);
            const resultado = await fetch(`${API_EMPLEADOS}/${tarjeta.dataset.id}/permisos`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ permisos })
            });
            const mensaje = tarjeta.querySelector(".mensajePermisos");
            const datos = await resultado.json();
            mensaje.textContent = resultado.ok ? "Permisos actualizados." : (datos.message || "No se pudieron guardar.");
        });
    });
}