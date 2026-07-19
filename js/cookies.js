//======================================
// COOKIES
// Agencia de Bicicletas El Unicornio Azul
//======================================

document.addEventListener("DOMContentLoaded", () => {

    const banner =
        document.getElementById("cookieBanner");

    const botonAceptar =
        document.getElementById("btnAceptarCookies");

    const botonRechazar =
        document.getElementById("btnRechazarCookies");

    const botonGestionar =
        document.getElementById("btnGestionarCookies");

    // Si la página no tiene banner, salir.
    if (!banner) {

        return;

    }

    //======================================
    // Mostrar banner solamente la primera vez
    //======================================

    if (localStorage.getItem("cookiesAceptadas") === null) {

        banner.style.display = "block";

    }

    //======================================
    // Guardar preferencia
    //======================================

    function guardarPreferencia(aceptadas) {

        localStorage.setItem(
            "cookiesAceptadas",
            aceptadas
        );

        if (aceptadas) {

            const preferencias = {

                sesion: true,
                localizacion: true,
                estadisticas: true,
                marketing: true,
                personalizacion: true,
                idioma: "es"

            };

            localStorage.setItem(
                "preferenciasCookies",
                JSON.stringify(preferencias)
            );

        }

        banner.style.display = "none";

        if (typeof mostrarToast === "function") {

            mostrarToast(

                aceptadas
                    ? "🍪 Preferencias guardadas correctamente."
                    : "🍪 Has rechazado las cookies.",

                aceptadas ? "exito" : "info"

            );

        }

    }

    //======================================
    // Botón aceptar
    //======================================

    if (botonAceptar) {

        botonAceptar.addEventListener("click", () => {

            guardarPreferencia(true);

        });

    }

    //======================================
    // Botón rechazar
    //======================================

    if (botonRechazar) {

        botonRechazar.addEventListener("click", () => {

            guardarPreferencia(false);

        });

    }

    //======================================
    // Gestionar preferencias
    //======================================

    if (botonGestionar) {

        botonGestionar.addEventListener("click", () => {

            window.location.href = "preferenciasCookies.html";

        });

    }

});


//======================================
// REINICIAR COOKIES
//======================================

function reiniciarCookies(){

    mostrarConfirmacion(

        "¿Deseas restablecer las preferencias de cookies?",

        function(){

            localStorage.removeItem("cookiesAceptadas");
            localStorage.removeItem("preferenciasCookies");

            mostrarToast(

                "🍪 Preferencias eliminadas correctamente.",

                "exito"

            );

            setTimeout(() => {

                location.reload();

            }, 900);

        }

    );

}