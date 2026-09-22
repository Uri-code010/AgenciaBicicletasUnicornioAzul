//=====================================
// PANEL ADMINISTRADOR
//=====================================

async function verificarAccesoAdmin() {
    try {
        const respuesta = await fetch("http://127.0.0.1:4000/api/auth/me", {
            credentials: "include"
        });

        if (!respuesta.ok) {
            window.location.href = "adminLogin.html";
            return false;
        }

        const usuario = await respuesta.json();
        const tienePermiso = usuario.permisos?.includes("*") || usuario.permisos?.includes("dashboard:ver");
        if (!tienePermiso) {
            await fetch("http://127.0.0.1:4000/api/auth/logout", {
                method: "POST",
                credentials: "include"
            });
            window.location.href = "login.html";
            return false;
        }

        return true;
    } catch (error) {
        console.error(error);
        window.location.href = "adminLogin.html";
        return false;
    }
}

function inicializarDashboard() {
    const productos = JSON.parse(localStorage.getItem("productos")) || [];
    const usuarios = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];
    const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    const totalProductos = productos.length;
    const totalClientes = usuarios.length;
    const totalPedidos = pedidos.length;

    const hoy = new Date();
    const hoyTexto = hoy.toLocaleDateString("es-MX");

    const pedidosHoy = pedidos.filter(pedido => {
        try {
            const fechaPedido = new Date(pedido.fecha);
            return fechaPedido.toLocaleDateString("es-MX") === hoyTexto;
        } catch (error) {
            return false;
        }
    }).length;

    const ventasMes = pedidos.reduce((total, pedido) => {
        try {
            const fechaPedido = new Date(pedido.fecha);
            if (
                fechaPedido.getMonth() === hoy.getMonth() &&
                fechaPedido.getFullYear() === hoy.getFullYear()
            ) {
                return total + Number(pedido.total || 0);
            }
        } catch (error) {
        }
        return total;
    }, 0);

    const agotados = productos.filter(producto =>
        producto.estado === "Agotado" || Number(producto.existencia) <= 0
    ).length;

    const actividad = [];

    if (pedidos.length > 0) {
        const pedidosRecientes = pedidos.slice(-3).reverse();
        pedidosRecientes.forEach(pedido => {
            actividad.push(`📦 Pedido #${pedido.id} - ${pedido.estado}`);
        });
    }

    if (usuarios.length > 0) {
        const ultimosUsuarios = usuarios.slice(-3).reverse();
        ultimosUsuarios.forEach(usuario => {
            actividad.push(`👤 Nuevo cliente: ${usuario.correo || usuario.nombre || "anónimo"}`);
        });
    }

    if (actividad.length === 0) {
        actividad.push("No hay actividad reciente.");
    }

    const actividadContainer = document.getElementById("actividadReciente");
    if (actividadContainer) {
        actividadContainer.innerHTML = actividad
            .slice(0, 5)
            .map(item => `<li>${item}</li>`)
            .join("");
    }

    const totalProductosEl = document.getElementById("totalProductos");
    if (totalProductosEl) {
        totalProductosEl.innerText = totalProductos;
    }

    const clientesEl = document.getElementById("clientes");
    if (clientesEl) {
        clientesEl.innerText = totalClientes;
    }

    const pedidosHoyEl = document.getElementById("pedidosHoy");
    if (pedidosHoyEl) {
        pedidosHoyEl.innerText = pedidosHoy;
    }

    const ventasMesEl = document.getElementById("ventasMes");
    if (ventasMesEl) {
        ventasMesEl.innerText = "$" + ventasMes.toLocaleString();
    }

    const agotadosEl = document.getElementById("agotados");
    if (agotadosEl) {
        agotadosEl.innerText = agotados;
    }

    agregarEventosAcciones();
}

function agregarEventosAcciones() {
    const btnAgregarProducto = document.getElementById("btnAgregarProducto");
    const btnVerPedidos = document.getElementById("btnVerPedidos");
    const btnCrearPromocion = document.getElementById("btnCrearPromocion");

    if (btnAgregarProducto) {
        btnAgregarProducto.addEventListener("click", () => {
            window.location.href = "productosAdmin.html";
        });
    }

    if (btnVerPedidos) {
        btnVerPedidos.addEventListener("click", () => {
            window.location.href = "pedidosAdmin.html";
        });
    }

    if (btnCrearPromocion) {
        btnCrearPromocion.addEventListener("click", () => {
            window.location.href = "promocionesAdmin.html";
        });
    }
}

async function iniciarDashboard() {
    if (await verificarAccesoAdmin()) {
        inicializarDashboard();
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciarDashboard);
} else {
    iniciarDashboard();
}

