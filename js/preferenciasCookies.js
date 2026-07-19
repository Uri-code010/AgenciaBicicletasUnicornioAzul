//==============================
// CARGAR PREFERENCIAS
//==============================

window.onload = function(){

    const preferencias =
    JSON.parse(localStorage.getItem("preferenciasCookies"));

    if(!preferencias){
        return;
    }

    document.getElementById("sesion").checked =
    preferencias.sesion;

    document.getElementById("localizacion").checked =
    preferencias.localizacion;

    document.getElementById("estadisticas").checked =
    preferencias.estadisticas;

    document.getElementById("marketing").checked =
    preferencias.marketing;

    document.getElementById("personalizacion").checked =
    preferencias.personalizacion;

    document.getElementById("idioma").value =
    preferencias.idioma;

};


//==============================
// GUARDAR PREFERENCIAS
//==============================

function guardarPreferencias(){

    const preferencias={

        sesion:
        document.getElementById("sesion").checked,

        localizacion:
        document.getElementById("localizacion").checked,

        estadisticas:
        document.getElementById("estadisticas").checked,

        marketing:
        document.getElementById("marketing").checked,

        personalizacion:
        document.getElementById("personalizacion").checked,

        idioma:
        document.getElementById("idioma").value

    };

    localStorage.setItem(

        "preferenciasCookies",

        JSON.stringify(preferencias)

    );

    localStorage.setItem(

        "cookiesAceptadas",

        "true"

    );

    mostrarToast(

        "✅ Preferencias guardadas correctamente.",

        "exito"

    );

}