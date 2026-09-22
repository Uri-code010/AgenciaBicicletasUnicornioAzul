(async function protegerModuloAdmin() {
    const permisosPorPagina = {
        "admin.html": "dashboard:ver",
        "clientesAdmin.html": "clientes:ver",
        "dashboardMetricas.html": "metricas:ver",
        "productosAdmin.html": "productos:ver",
        "pedidosAdmin.html": "pedidos:ver",
        "promocionesAdmin.html": "promociones:ver",
        "reportesAdmin.html": "reportes:ver"
    };
    const pagina = window.location.pathname.split("/").pop();
    const permisoNecesario = permisosPorPagina[pagina] || "admin:panel";

    try {
        const respuesta = await fetch("http://127.0.0.1:4000/api/auth/me", { credentials: "include" });
        if (!respuesta.ok) {
            window.location.replace("adminLogin.html");
            return;
        }

        const usuario = await respuesta.json();
        const tienePermiso = usuario.permisos?.includes("*") || usuario.permisos?.includes(permisoNecesario);
        if (!tienePermiso) {
            window.location.replace("admin.html");
        }
    } catch (error) {
        console.error(error);
        window.location.replace("adminLogin.html");
    }
})();