//==========================================
// PUBLICACIONES Y SUBASTAS
// Agencia de Bicicletas El Unicornio Azul
//==========================================

// Lee las publicaciones guardadas y la sesión actual.
let publicaciones =

JSON.parse(

    localStorage.getItem("publicaciones")

) || [];

const usuarioPublicacion =

JSON.parse(

    localStorage.getItem("usuarioActual")

);

const CLAVE_PUBLICACIONES = "publicaciones";
const CLAVE_NOTIFICACIONES_SUBASTA = "notificacionesSubasta";

// Guarda el listado completo de publicaciones.
function guardarPublicaciones(){

    localStorage.setItem(

        CLAVE_PUBLICACIONES,

        JSON.stringify(publicaciones)

    );

}

// Guarda las notificaciones de subasta.
function guardarNotificacionesSubasta(notificaciones){

    localStorage.setItem(

        CLAVE_NOTIFICACIONES_SUBASTA,

        JSON.stringify(notificaciones)

    );

}

// Agrega una notificación nueva para un correo específico.
function agregarNotificacionSubasta(correo,mensaje){

    if(!correo || !mensaje){

        return;

    }

    const notificaciones =

    JSON.parse(

        localStorage.getItem(CLAVE_NOTIFICACIONES_SUBASTA)

    ) || [];

    notificaciones.push({

        id:Date.now() + Math.floor(Math.random() * 1000),

        correo:correo,

        mensaje:mensaje,

        fecha:new Date().toLocaleString(),

        leida:false

    });

    guardarNotificacionesSubasta(notificaciones);

}

// Muestra las notificaciones pendientes del usuario actual y las marca como leídas.
function revisarNotificacionesSubasta(){

    if(!usuarioPublicacion || !usuarioPublicacion.correo){

        return;

    }

    let notificaciones =

    JSON.parse(

        localStorage.getItem(CLAVE_NOTIFICACIONES_SUBASTA)

    ) || [];

    let huboCambios = false;

    notificaciones.forEach(n=>{

        if(
            n.correo == usuarioPublicacion.correo
            &&
            !n.leida
        ){

            if(typeof mostrarToast === "function"){

                mostrarToast("🔔 " + n.mensaje, "info");

            }

            n.leida = true;

            huboCambios = true;

        }

    });

    if(huboCambios){

        guardarNotificacionesSubasta(notificaciones);

    }

}

// Devuelve la mejor oferta disponible de una subasta.
function obtenerMejorOferta(subasta){

    if(!subasta || !Array.isArray(subasta.ofertas) || subasta.ofertas.length===0){

        return null;

    }

    return subasta.ofertas.reduce((mejor,actual)=>{

        return Number(actual.monto) > Number(mejor.monto) ? actual : mejor;

    });

}

// Calcula el monto mínimo para la siguiente oferta.
function obtenerMontoMinimo(subasta){

    const mejor = obtenerMejorOferta(subasta);

    if(mejor){

        return Number(mejor.monto) + 1;

    }

    return Number(subasta.precio || 0);

}

// Construye el texto visible con el tiempo restante de la subasta.
function obtenerTextoTiempoRestante(fechaFin){

    if(!fechaFin){

        return "Sin fecha de cierre";

    }

    const cierre = new Date(fechaFin + "T23:59:59").getTime();
    const ahora = Date.now();
    const diferencia = cierre - ahora;

    if(diferencia <= 0){

        return "Subasta cerrada";

    }

    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));

    if(dias > 0){

        return dias + " día(s) " + horas + " h restantes";

    }

    return horas + " h " + minutos + " min restantes";

}

// Cierra una subasta si ya pasó su fecha límite.
function cerrarSubastaSiCorresponde(publicacion){

    if(!publicacion || publicacion.tipo !== "subasta"){

        return false;

    }

    if(publicacion.cerrada){

        return false;

    }

    const fechaCierre = publicacion.fechaFin
    ?
    new Date(publicacion.fechaFin + "T23:59:59").getTime()
    :
    NaN;

    if(Number.isNaN(fechaCierre) || Date.now() < fechaCierre){

        return false;

    }

    publicacion.cerrada = true;
    publicacion.fechaCierreReal = new Date().toLocaleString();

    const mejorOferta = obtenerMejorOferta(publicacion);

    if(mejorOferta){

        publicacion.ganador = {

            nombre:mejorOferta.usuario,

            correo:mejorOferta.correo,

            monto:Number(mejorOferta.monto),

            fecha:mejorOferta.fecha

        };

        agregarNotificacionSubasta(

            mejorOferta.correo,

            `Ganaste la subasta "${publicacion.titulo}" con $${Number(mejorOferta.monto).toFixed(2)}.`

        );

    }

    else{

        publicacion.ganador = null;

    }

    if(publicacion.correoCreador){

        const mensajeCreador = publicacion.ganador
        ?
        `Tu subasta "${publicacion.titulo}" cerró. Ganador: ${publicacion.ganador.nombre} por $${Number(publicacion.ganador.monto).toFixed(2)}.`
        :
        `Tu subasta "${publicacion.titulo}" cerró sin ofertas.`;

        agregarNotificacionSubasta(publicacion.correoCreador,mensajeCreador);

    }

    return true;

}

// Recorre todas las publicaciones y cierra las subastas vencidas.
function actualizarCierresAutomaticos(){

    let huboCambios = false;

    publicaciones.forEach(p=>{

        if(cerrarSubastaSiCorresponde(p)){

            huboCambios = true;

        }

    });

    if(huboCambios){

        guardarPublicaciones();

    }

}

// Normaliza datos antiguos para que las subastas sigan siendo compatibles.
function normalizarSubastas(){

    let huboCambios = false;

    publicaciones.forEach(p=>{

        if(p.tipo !== "subasta"){

            return;

        }

        if(!Array.isArray(p.ofertas)){

            p.ofertas = [];
            huboCambios = true;

        }

        if(typeof p.cerrada !== "boolean"){

            p.cerrada = false;
            huboCambios = true;

        }

        if(!p.correoCreador && p.usuario && usuarioPublicacion && p.usuario === usuarioPublicacion.nombre){

            p.correoCreador = usuarioPublicacion.correo;
            huboCambios = true;

        }

        if(typeof p.precio !== "number"){

            p.precio = Number(p.precio || 0);
            huboCambios = true;

        }

    });

    if(huboCambios){

        guardarPublicaciones();

    }

}

// Abre el formulario de publicación con sus campos dinámicos.
function cambiarFormulario(){

    const tipoEl = document.getElementById("tipoPublicacion");
    const extra = document.getElementById("camposExtra");

    if(!tipoEl || !extra){
        return;
    }

    const tipo = tipoEl.value;

    extra.innerHTML = "";

    switch(tipo){

        case "venta":

            extra.innerHTML=`

                <input

                    id="precio"

                    type="number"

                    placeholder="Precio">

                <br><br>

            `;

        break;



        case "subasta":

            extra.innerHTML=`

                <input

                    id="precio"

                    type="number"

                    placeholder="Precio inicial">

                <br><br>

                <label>

                    Finaliza el:

                </label>

                <br>

                <input

                    id="fechaFin"

                    type="date">

                <br><br>

            `;

        break;



        case "rodada":

            extra.innerHTML=`

                <input

                    id="lugar"

                    type="text"

                    placeholder="Lugar">

                <br><br>

                <input

                    id="fechaRodada"

                    type="date">

                <br><br>

                <input

                    id="horaRodada"

                    type="time">

                <br><br>

            `;

        break;



        case "busco":

            extra.innerHTML=`

                <input

                    id="presupuesto"

                    type="number"

                    placeholder="Presupuesto">

                <br><br>

            `;

        break;

    }

}

// Inserta el formulario de nueva publicación.
function cargarFormularioPublicacion(){

    const contenedor =

    document.getElementById("nuevaPublicacion");

    if(!contenedor){

        return;

    }

    if(!usuarioPublicacion){

        contenedor.innerHTML=`

        <div class="mensajeLogin">

            🔒 Inicia sesión para publicar.

        </div>

        `;

        return;

    }

    contenedor.innerHTML=`

        <h2>

            Crear publicación

        </h2>

        <select

            id="tipoPublicacion"

            onchange="cambiarFormulario()">

            <option value="publicacion">

                Publicación

            </option>

            <option value="venta">

                Venta

            </option>

            <option value="subasta">

                Subasta

            </option>

            <option value="rodada">

                Rodada

            </option>

            <option value="busco">

                Busco

            </option>

        </select>

        <br><br>

        <div id="camposExtra">

        </div>

        <br><br>

        <input

            id="tituloPublicacion"

            type="text"

            placeholder="Título">

        <br><br>

        <textarea

            id="descripcionPublicacion"

            rows="5"

            placeholder="¿Qué deseas publicar?">

        </textarea>

        <br><br>

        <button

            class="boton"

            onclick="publicar()">

            Publicar

        </button>

    `;

    // Inicializa los campos dinámicos después de renderizar el formulario.
    cambiarFormulario();

}

// Guarda una nueva publicación en localStorage.
function publicar(){

    const titulo =

    document.getElementById("tituloPublicacion").value.trim();

    const descripcion =

    document.getElementById("descripcionPublicacion").value.trim();

    const tipo =

    document.getElementById("tipoPublicacion").value;

    const precioEl = document.getElementById("precio");
    const fechaFinEl = document.getElementById("fechaFin");

    const precio = precioEl ? Number(precioEl.value) : 0;
    const fechaFin = fechaFinEl ? fechaFinEl.value : "";

    if(titulo=="" || descripcion==""){

        mostrarToast(

            "Completa toda la información.",

            "advertencia"

        );

        return;

    }

    if(tipo === "subasta"){

        if(!precio || precio <= 0){

            mostrarToast(

                "Ingresa un precio inicial válido para la subasta.",

                "advertencia"

            );

            return;

        }

        if(!fechaFin){

            mostrarToast(

                "Selecciona la fecha de cierre de la subasta.",

                "advertencia"

            );

            return;

        }

        const fechaFinMs = new Date(fechaFin + "T23:59:59").getTime();

        if(Number.isNaN(fechaFinMs) || fechaFinMs <= Date.now()){

            mostrarToast(

                "La fecha de cierre debe ser posterior a hoy.",

                "advertencia"

            );

            return;

        }

    }

    publicaciones.unshift({

    id:Date.now(),

    tipo:tipo,

    usuario:usuarioPublicacion.nombre,

    correoCreador:usuarioPublicacion.correo,

    titulo:titulo,

    descripcion:descripcion,

    fecha:new Date().toLocaleString(),

    likes:0,

    comentarios:[],

    precio:precio,

    fechaFin:fechaFin,

    cerrada:false,

    ganador:null,

    ofertas:[],

    lugar:

        document.getElementById("lugar")

        ?

        document.getElementById("lugar").value

        :

        "",

    fechaRodada:

        document.getElementById("fechaRodada")

        ?

        document.getElementById("fechaRodada").value

        :

        "",

    horaRodada:

        document.getElementById("horaRodada")

        ?

        document.getElementById("horaRodada").value

        :

        "",

    presupuesto:

        document.getElementById("presupuesto")

        ?

        document.getElementById("presupuesto").value

        :

        ""

    });

    guardarPublicaciones();

    mostrarToast(

        "Publicación creada.",

        "exito"

    );

    mostrarPublicaciones();

    mostrarMisSubastas();

    // Limpia el formulario después de publicar.
    const tituloEl = document.getElementById('tituloPublicacion');
    const descEl = document.getElementById('descripcionPublicacion');
    const tipoEl = document.getElementById('tipoPublicacion');
    if(tituloEl) tituloEl.value = '';
    if(descEl) descEl.value = '';
    if(tipoEl) {
        tipoEl.value = 'publicacion';
        cambiarFormulario();
    }

}

// Registra una oferta en una subasta activa.
function ofertarEnSubasta(idSubasta){

    const publicacion = publicaciones.find(p=>p.id==idSubasta && p.tipo==="subasta");

    if(!publicacion){

        mostrarToast("No se encontró la subasta.","error");
        return;

    }

    cerrarSubastaSiCorresponde(publicacion);

    if(publicacion.cerrada){

        guardarPublicaciones();
        mostrarPublicaciones();
        mostrarMisSubastas();
        mostrarToast("Esta subasta ya está cerrada.","advertencia");
        return;

    }

    if(!usuarioPublicacion){

        mostrarConfirmacion(

            "Debes iniciar sesión para ofertar.",

            ()=>{

                window.location.href="login.html";

            }

        );

        return;

    }

    if(publicacion.correoCreador && publicacion.correoCreador === usuarioPublicacion.correo){

        mostrarToast("No puedes ofertar en tu propia subasta.","advertencia");
        return;

    }

    const inputOferta = document.getElementById("ofertaSubasta_" + idSubasta);

    if(!inputOferta){

        return;

    }

    const monto = Number(inputOferta.value);
    const minimo = obtenerMontoMinimo(publicacion);

    if(!monto || monto < minimo){

        mostrarToast(`Tu oferta debe ser de al menos $${minimo.toFixed(2)}.`,"advertencia");
        return;

    }

    const mejorAnterior = obtenerMejorOferta(publicacion);

    publicacion.ofertas.push({

        id:Date.now(),

        usuario:usuarioPublicacion.nombre,

        correo:usuarioPublicacion.correo,

        monto:Number(monto),

        fecha:new Date().toLocaleString()

    });

    if(mejorAnterior && mejorAnterior.correo !== usuarioPublicacion.correo){

        agregarNotificacionSubasta(

            mejorAnterior.correo,

            `Te superaron en la subasta "${publicacion.titulo}". Nueva mejor oferta: $${Number(monto).toFixed(2)}.`

        );

    }

    if(publicacion.correoCreador){

        agregarNotificacionSubasta(

            publicacion.correoCreador,

            `${usuarioPublicacion.nombre} ofertó $${Number(monto).toFixed(2)} en tu subasta "${publicacion.titulo}".`

        );

    }

    guardarPublicaciones();
    inputOferta.value = "";
    mostrarPublicaciones();
    mostrarMisSubastas();
    mostrarToast("Oferta registrada exitosamente.","exito");

}

// Cierra manualmente una subasta si el creador lo solicita.
function cerrarSubastaManual(idSubasta){

    const publicacion = publicaciones.find(p=>p.id==idSubasta && p.tipo==="subasta");

    if(!publicacion || publicacion.cerrada){

        return;

    }

    if(!usuarioPublicacion || publicacion.correoCreador !== usuarioPublicacion.correo){

        mostrarToast("Solo el creador puede cerrar esta subasta.","advertencia");
        return;

    }

    publicacion.fechaFin = new Date().toISOString().slice(0,10);
    cerrarSubastaSiCorresponde(publicacion);
    guardarPublicaciones();
    mostrarPublicaciones();
    mostrarMisSubastas();
    mostrarToast("Subasta cerrada.","info");

}

// Devuelve la tarjeta HTML de una subasta.
function renderizarTarjetaSubasta(p){

    const mejorOferta = obtenerMejorOferta(p);
    const mejorMonto = mejorOferta ? Number(mejorOferta.monto) : null;
    const historial = Array.isArray(p.ofertas)
    ?
    p.ofertas.slice().sort((a,b)=>Number(b.monto)-Number(a.monto))
    :
    [];

    const montoMinimo = obtenerMontoMinimo(p);

    const historialHTML = historial.length > 0
    ?
    historial.map((oferta,indice)=>`
            <li>
                <span>#${indice + 1} ${oferta.usuario}</span>
                <strong>$${Number(oferta.monto).toFixed(2)}</strong>
            </li>
        `).join("")
    :
    "<li>Sin ofertas todavía.</li>";

    const estadoClase = p.cerrada ? "subastaCerrada" : "subastaActiva";
    const estadoTexto = p.cerrada ? "Cerrada" : "Activa";

    const esCreador =
    usuarioPublicacion
    &&
    p.correoCreador
    &&
    usuarioPublicacion.correo === p.correoCreador;

    const ganadorHTML = p.cerrada
    ?
    (p.ganador
        ?
        `<p class="subastaGanador">🏆 Ganador: ${p.ganador.nombre} con $${Number(p.ganador.monto).toFixed(2)}</p>`
        :
        '<p class="subastaGanador">🔒 Subasta cerrada sin ofertas.</p>')
    :
    "";

    return `
        <div class="cardPublicacion cardSubasta ${estadoClase}">
            <div class="subastaHeader">
                <small>SUBASTA</small>
                <span class="subastaEstado">${estadoTexto}</span>
            </div>

            <h2>${p.titulo}</h2>
            <p>${p.descripcion}</p>

            <div class="subastaDatos">
                <p><strong>Precio inicial:</strong> $${Number(p.precio || 0).toFixed(2)}</p>
                <p><strong>Fecha de cierre:</strong> ${p.fechaFin || "Sin fecha"}</p>
                <p><strong>Tiempo:</strong> ${obtenerTextoTiempoRestante(p.fechaFin)}</p>
                <p><strong>Mejor oferta:</strong> ${mejorMonto !== null ? "$" + mejorMonto.toFixed(2) + " por " + mejorOferta.usuario : "Sin ofertas"}</p>
            </div>

            ${ganadorHTML}

            <div class="subastaAcciones">
                ${
                    p.cerrada
                    ?
                    '<button class="boton" disabled>Subasta cerrada</button>'
                    :
                    `<input id="ofertaSubasta_${p.id}" type="number" min="${montoMinimo}" step="1" placeholder="Tu oferta (mínimo $${montoMinimo.toFixed(2)})">
                     <button class="boton" onclick="ofertarEnSubasta(${p.id})">Ofertar</button>`
                }
                ${
                    !p.cerrada && esCreador
                    ?
                    `<button class="botonSecundario" onclick="cerrarSubastaManual(${p.id})">Cerrar ahora</button>`
                    :
                    ""
                }
            </div>

            <div class="subastaHistorial">
                <h3>Historial de ofertas</h3>
                <ul>
                    ${historialHTML}
                </ul>
            </div>

            <small>👤 ${p.usuario}</small>
            <br>
            <small>🕒 ${p.fecha}</small>
        </div>
    `;

}

// Renderiza todas las publicaciones visibles.
function mostrarPublicaciones(){

    const lista =

    document.getElementById("listaPublicaciones");

    if(!lista){

        return;

    }

    lista.innerHTML="";

    actualizarCierresAutomaticos();

    if(publicaciones.length===0){

        lista.innerHTML = `
        <div class="sinComentarios">
            Todavía no hay publicaciones.
        </div>
        `;

        return;

    }

    publicaciones.forEach(p=>{

        if(p.tipo === "subasta"){

            lista.innerHTML += renderizarTarjetaSubasta(p);

            return;

        }

        lista.innerHTML +=`

        <div class="cardPublicacion">

            <small>

                ${p.tipo.toUpperCase()}

            </small>

            <h2>

                ${p.titulo}

            </h2>

            <p>

                ${p.descripcion}

            </p>

            <small>

                👤 ${p.usuario}

            </small>

            <br>

            <small>

                🕒 ${p.fecha}

            </small>

        </div>

        `;

    });

}

// Muestra las subastas del usuario actual.
function mostrarMisSubastas(){

    const contenedor = document.getElementById("misSubastas");

    if(!contenedor){

        return;

    }

    if(!usuarioPublicacion || !usuarioPublicacion.correo){

        contenedor.innerHTML = `
            <div class="mensajeLogin">
                🔒 Inicia sesión para ver tus subastas y tus ofertas.
            </div>
        `;

        return;

    }

    const mias = publicaciones.filter(p=>{

        if(p.tipo !== "subasta"){

            return false;

        }

        const soyCreador = p.correoCreador === usuarioPublicacion.correo;
        const participe = Array.isArray(p.ofertas) && p.ofertas.some(o=>o.correo === usuarioPublicacion.correo);

        return soyCreador || participe;

    });

    if(mias.length===0){

        contenedor.innerHTML = `
            <div class="sinComentarios">
                Aún no tienes subastas creadas ni participaciones.
            </div>
        `;

        return;

    }

    contenedor.innerHTML = mias.map(p=>{

        const mejor = obtenerMejorOferta(p);
        const soyCreador = p.correoCreador === usuarioPublicacion.correo;

        return `
            <div class="cardMisSubastas">
                <h3>${p.titulo}</h3>
                <p><strong>Rol:</strong> ${soyCreador ? "Creador" : "Participante"}</p>
                <p><strong>Estado:</strong> ${p.cerrada ? "Cerrada" : "Activa"}</p>
                <p><strong>Mejor oferta:</strong> ${mejor ? "$" + Number(mejor.monto).toFixed(2) : "Sin ofertas"}</p>
                ${p.cerrada && p.ganador ? `<p><strong>Ganador:</strong> ${p.ganador.nombre}</p>` : ""}
            </div>
        `;

    }).join("");

}

// Inicializa subastas, cierres automáticos y renderizado al cargar la página.
document.addEventListener("DOMContentLoaded",()=>{

    normalizarSubastas();

    actualizarCierresAutomaticos();

    cargarFormularioPublicacion();

    mostrarPublicaciones();

    mostrarMisSubastas();

    revisarNotificacionesSubasta();

    setInterval(()=>{

        actualizarCierresAutomaticos();

        mostrarPublicaciones();

        mostrarMisSubastas();

    },60000);

});