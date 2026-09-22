const API_AUTH = "http://127.0.0.1:4000/api/auth";

document.getElementById("formAdminLogin").addEventListener("submit", async function (e) {
    e.preventDefault();

    const correo = document.getElementById("correoAdminLogin").value.trim();
    const password = document.getElementById("passwordAdminLogin").value;
    const mensaje = document.getElementById("mensajeAdminLogin");

    try {
        const respuesta = await fetch(`${API_AUTH}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // necesario para que el navegador guarde la cookie de sesión
            body: JSON.stringify({ correo, password })
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            mensaje.innerHTML = ` ${datos.message || "Correo o contraseña incorrectos."}`;
            return;
        }

        if (!datos.usuario || !(datos.usuario.permisos || []).some((permiso) => permiso === "*" || permiso === "dashboard:ver")) {
            await fetch(`${API_AUTH}/logout`, { method: "POST", credentials: "include" });
            mensaje.innerHTML = "Esta cuenta no tiene permisos de administrador.";
            return;
        }

        mensaje.innerHTML = " Acceso correcto, entrando...";

        setTimeout(() => {
            window.location.href = "clientesAdmin.html";
        }, 600);

    } catch (error) {
        console.error(error);
        mensaje.innerHTML = " No se pudo conectar con el servidor. Verifica que el backend esté corriendo.";
    }
});