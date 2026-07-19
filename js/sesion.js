//=====================================
// SESIÓN
// Agencia de Bicicletas El Unicornio Azul
//=====================================

document.addEventListener("DOMContentLoaded", () => {

    const usuario =
    JSON.parse(localStorage.getItem("usuarioActual"));

    const menuSesion =
    document.getElementById("menuSesion");

    if(!menuSesion){

        return;

    }

    //=====================================
    // SIN SESIÓN
    //=====================================

    if(!usuario){

        menuSesion.innerHTML = `

            <a href="login.html">

                👤 Iniciar sesión

            </a>

        `;

        return;

    }

    //=====================================
    // PEDIDOS DEL USUARIO
    //=====================================

    const pedidos =
    JSON.parse(localStorage.getItem("pedidos")) || [];

    const comprasUsuario = pedidos.filter(p =>

        p.correo &&
        usuario.correo &&
        p.correo.toLowerCase() === usuario.correo.toLowerCase()

    ).length;

    //=====================================
    // NIVEL
    //=====================================

    let nivel = "🆕 Cliente nuevo";

    if(comprasUsuario >= 3){

        nivel = "⭐ Cliente Preferente";

    }

    if(comprasUsuario >= 8){

        nivel = "🥇 Cliente Oro";

    }

    //=====================================
    // MENÚ
    //=====================================

    menuSesion.className = "menuUsuario";

    menuSesion.innerHTML = `

    <div class="usuarioMenu">

        <button class="usuarioBoton">

            <div class="avatarMini">

                ${(usuario.nombre || "?").charAt(0).toUpperCase()}

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

            <div class="usuarioHeader">

                <div class="avatarGrande">

                    ${(usuario.nombre || "?").charAt(0).toUpperCase()}

                </div>

                <div>

                    <strong>

                        ${usuario.nombre}

                    </strong>

                    <br>

                    <small>

                        ${usuario.correo}

                    </small>

                    <br>

                    <small>

                        ${nivel}

                    </small>

                    <br>

                    <small>

                        ${comprasUsuario} compra(s)

                    </small>

                </div>

            </div>

            <hr>

            <a href="perfil.html">

                👤 Mi perfil

            </a>

            <a href="historial.html">

                📦 Mis pedidos

            </a>

            <a href="favoritos.html">

                ❤️ Mis favoritos

            </a>

            <a href="comunidad.html">

                🌎 Mi comunidad

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

    `;

});

//=====================================
// CERRAR SESIÓN
//=====================================

function cerrarSesion(){

    mostrarConfirmacion(

        "¿Deseas cerrar tu sesión?",

        ()=>{

            localStorage.removeItem("usuarioActual");

            localStorage.removeItem("sesionActiva");

            mostrarToast(

                "👋 Hasta pronto.",

                "info"

            );

            setTimeout(()=>{

                window.location.href = "index.html";

            },800);

        },

        ()=>{}

    );

}