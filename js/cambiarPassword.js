const API_PASSWORD = "http://127.0.0.1:4000/api/auth/password";

function conectarFormularioPassword(formId, actualId, nuevaId, confirmarId, mensajeId) {
    const formulario = document.getElementById(formId);
    if (!formulario) return;

    formulario.addEventListener("submit", async (event) => {
        event.preventDefault();
        const mensaje = document.getElementById(mensajeId);
        const passwordNueva = document.getElementById(nuevaId).value;
        const confirmarPassword = document.getElementById(confirmarId).value;

        if (passwordNueva !== confirmarPassword) {
            mensaje.textContent = "Las contraseñas nuevas no coinciden.";
            return;
        }

        try {
            const respuesta = await fetch(API_PASSWORD, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    passwordActual: document.getElementById(actualId).value,
                    passwordNueva,
                    confirmarPassword
                })
            });
            const datos = await respuesta.json();
            mensaje.textContent = datos.message || (respuesta.ok ? "Contraseña actualizada." : "No se pudo actualizar.");
            if (respuesta.ok) formulario.reset();
        } catch (error) {
            console.error(error);
            mensaje.textContent = "No se pudo conectar con el servidor.";
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    conectarFormularioPassword("formPasswordPerfil", "passwordActualPerfil", "passwordNuevaPerfil", "confirmarPasswordPerfil", "mensajePasswordPerfil");
    conectarFormularioPassword("formPasswordAdmin", "passwordActualAdmin", "passwordNuevaAdmin", "confirmarPasswordAdmin", "mensajePasswordAdmin");
});