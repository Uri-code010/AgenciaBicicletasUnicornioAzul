function revisarNotificaciones(){

    const usuario =

    JSON.parse(

        localStorage.getItem("usuarioActual")

    );

    if(!usuario){

        return;

    }

    let notificaciones =

    JSON.parse(

        localStorage.getItem("notificaciones")

    ) || [];

    let huboCambios = false;

    notificaciones.forEach(n=>{

        if(

            n.correo == usuario.correo

            &&

            !n.leida

        ){

            if(typeof mostrarToast === "function"){

                mostrarToast(

                    `📦 Tu pedido #${n.pedido} ahora está "${n.estado}".`,

                    "info"

                );

            }

            n.leida = true;

            huboCambios = true;

        }

    });

    if(huboCambios){

        localStorage.setItem(

            "notificaciones",

            JSON.stringify(notificaciones)

        );

    }

}

document.addEventListener(

    "DOMContentLoaded",

    revisarNotificaciones

);