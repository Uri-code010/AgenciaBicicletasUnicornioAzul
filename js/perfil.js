const API_PERFIL = "http://127.0.0.1:4000/api/auth";

document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("formContactoPerfil");
    const telefono = document.getElementById("telefonoPerfil");
    const mensaje = document.getElementById("mensajeContactoPerfil");
    const usuario = obtenerUsuarioActual();

    if (!formulario || !usuario) return;

    telefono.value = usuario.telefono || "";

    formulario.addEventListener("submit", async (event) => {
        event.preventDefault();
        const valor = telefono.value.trim();

        try {
            const respuesta = await fetch(`${API_PERFIL}/perfil`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ telefono: valor })
            });
            const datos = await respuesta.json();

            if (!respuesta.ok) {
                mensaje.textContent = datos.message || "No se pudo guardar el teléfono.";
                return;
            }

            const usuarioActualizado = { ...usuario, ...datos, telefono: valor };
            localStorage.setItem("usuarioActual", JSON.stringify(usuarioActualizado));

            const usuarios = obtenerUsuariosRegistrados();
            const indice = usuarios.findIndex((item) =>
                (item.correo || "").toLowerCase() === usuario.correo.toLowerCase()
            );
            if (indice >= 0) {
                usuarios[indice] = { ...usuarios[indice], telefono: valor };
                guardarUsuariosRegistrados(usuarios);
            }

            mensaje.textContent = "Contacto guardado correctamente.";
        } catch (error) {
            console.error(error);
            mensaje.textContent = "No se pudo conectar con el servidor.";
        }
    });

    iniciarMiniChat(usuario);
});

async function iniciarMiniChat(usuario) {
    const formulario = document.getElementById("formSolicitudCliente");
    const consulta = document.getElementById("consultaCliente");
    const mensaje = document.getElementById("mensajeSolicitudCliente");
    const lista = document.getElementById("misSolicitudesCliente");
    if (!formulario || !consulta || !mensaje || !lista) return;

    async function cargarSolicitudes() {
        const respuesta = await fetch("http://127.0.0.1:4000/api/interacciones/mias", { credentials: "include" });
        if (!respuesta.ok) return;
        const solicitudes = (await respuesta.json()).filter((item) => item.tipo === "petición");
        lista.innerHTML = solicitudes.length
            ? solicitudes.map((item) => `<p><strong>${new Date(item.fecha).toLocaleString("es-MX")}</strong>: ${item.descripcion}</p>`).join("")
            : "<p>Aún no has enviado consultas.</p>";
    }

    await cargarSolicitudes();
    formulario.addEventListener("submit", async (event) => {
        event.preventDefault();
        const descripcion = consulta.value.trim();
        if (!descripcion) return;

        try {
            const respuesta = await fetch("http://127.0.0.1:4000/api/interacciones/solicitudes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ descripcion })
            });
            const datos = await respuesta.json();
            if (!respuesta.ok) {
                mensaje.textContent = datos.message || "No se pudo enviar la consulta.";
                return;
            }

            consulta.value = "";
            mensaje.textContent = "Consulta enviada al equipo.";
            await cargarSolicitudes();
        } catch (error) {
            console.error(error);
            mensaje.textContent = "No se pudo conectar con el servidor.";
        }
    });
}