//=====================================
// MENÚ DINÁMICO
// Agencia de Bicicletas El Unicornio Azul
//=====================================

document.addEventListener("DOMContentLoaded", () => {

    const menu = document.getElementById("menuPrincipal");

    if (!menu) return;

    const usuario =
        JSON.parse(localStorage.getItem("usuarioActual"));

    let html = "";

    // Opciones para TODOS
    html += `
        <li><a href="index.html">🏠 Inicio</a></li>
        <li><a href="nosotros.html">🚴 Nosotros</a></li>
        <li><a href="catalogo.html">🛍 Catálogo</a></li>
        <li><a href="contacto.html">📞 Contacto</a></li>
    `;

    if(usuario){

        html += `
            <li class="menuUsuario">

            <div class="usuarioMenu">

            <button class="usuarioBoton">

            <div class="avatarMini">

            ${usuario.nombre.charAt(0).toUpperCase()}

            </div>

            <div class="usuarioInfo">

            <span class="usuarioNombre">

            👋 Hola, ${usuario.nombre}

            </span>

            <small>

            Mi cuenta ▼

            </small>

            </div>

            </button>

            <div class="usuarioDropdown">

            <a href="perfil.html">

            👤 Mi perfil

            </a>

            <a href="historial.html">

            📦 Mis pedidos

            </a>

            <a href="favoritos.html">

            ❤️ Favoritos

            </a>

            <a href="comunidad.html">

            🌎 Comunidad

            </a>

            <a href="carrito.html">

            🛒 Mi carrito

            </a>

            <hr>

            <a href="#"

            onclick="cerrarSesion();return false;">

            🚪 Cerrar sesión

            </a>

            </div>

            </div>

            </li>
        `;

    }else{

        html += `
           <li>

            <a href="comunidad.html">

            🌎 Comunidad

            </a>

            </li>

            <li>

            <a href="login.html">

            👤 Iniciar sesión

            </a>

            </li>

            <li>

            <a href="registro.html">

            📝 Registrarse

            </a>

            </li>
        `;
    }

    menu.innerHTML = html;

    if(typeof actualizarContadorCarrito==="function"){
        actualizarContadorCarrito();
    }

});