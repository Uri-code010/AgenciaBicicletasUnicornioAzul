const API_CONTACTO = "http://127.0.0.1:4000/api/interacciones/contacto";

document.getElementById("formContacto").addEventListener("submit", async (event) => {
    event.preventDefault();

    const mensajeExito = document.getElementById("mensajeExito");
    const datos = {
        nombre: document.getElementById("nombre").value.trim(),
        correo: document.getElementById("correo").value.trim(),
        telefono: document.getElementById("telefono").value.trim(),
        mensaje: document.getElementById("mensaje").value.trim()
    };

    try {
        const respuesta = await fetch(API_CONTACTO, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(datos)
        });
        const contenido = await respuesta.text();
        let resultado = {};
        try {
            resultado = contenido ? JSON.parse(contenido) : {};
        } catch (error) {
            resultado = { message: `El servidor respondió con HTTP ${respuesta.status}.` };
        }

        if (!respuesta.ok) {
            mensajeExito.textContent = resultado.message || "No se pudo enviar el mensaje.";
            mensajeExito.style.color = "red";
            return;
        }

        mensajeExito.textContent = "Mensaje enviado. El equipo lo revisará pronto.";
        mensajeExito.style.color = "green";
        event.target.reset();
    } catch (error) {
        console.error(error);
        mensajeExito.textContent = "No se pudo conectar con el servidor.";
        mensajeExito.style.color = "red";
    }
});