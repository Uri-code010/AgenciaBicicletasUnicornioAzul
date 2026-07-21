//==========================================
// COMUNIDAD
// Agencia de Bicicletas El Unicornio Azul
//==========================================


//==========================================
// VARIABLES
//==========================================

let resenas =
JSON.parse(
    localStorage.getItem("resenas")
) || [];

let comentarios =
JSON.parse(
    localStorage.getItem("comentariosComunidad")
) || [];

const usuario =
JSON.parse(
    localStorage.getItem("usuarioActual")
);


//==========================================
// INICIAR
//==========================================

document.addEventListener("DOMContentLoaded",()=>{

    ordenarResenas();

    ordenarComentarios();

    cargarFormulario();

    mostrarResenas();

    mostrarComentarios();

    renderizarEcosistemaComercial();

    inicializarNavegacionRapidaComunidad();

    inicializarAnimacionesComunidad();

});

function renderizarEcosistemaComercial(){

    const resumenEl = document.getElementById("resumenEcosistemaComercial");
    const promocionesEl = document.getElementById("escaparatePromocionesComunidad");
    const productosEl = document.getElementById("escaparateProductosComunidad");

    if(!resumenEl || !promocionesEl || !productosEl){
        return;
    }

    const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    const publicaciones = JSON.parse(localStorage.getItem("publicaciones")) || [];
    const promociones = JSON.parse(localStorage.getItem("promociones")) || [];
    const productos = JSON.parse(localStorage.getItem("productos")) || [];

    const subastas = publicaciones.filter((p)=>p.tipo === "subasta");
    const subastasActivas = subastas.filter((s)=>!s.cerrada);
    const comentariosTotales = comentarios.length;

    resumenEl.innerHTML = `
        <div class="cardEcosistema">
            <h4>B2C · Compras</h4>
            <div class="valorEcosistema">${pedidos.length}</div>
            <div class="detalleEcosistema">Pedidos registrados</div>
        </div>
        <div class="cardEcosistema">
            <h4>C2C · Publicaciones</h4>
            <div class="valorEcosistema">${publicaciones.length}</div>
            <div class="detalleEcosistema">Contenido de usuarios</div>
        </div>
        <div class="cardEcosistema">
            <h4>Subastas simuladas</h4>
            <div class="valorEcosistema">${subastasActivas.length}</div>
            <div class="detalleEcosistema">Activas ahora</div>
        </div>
        <div class="cardEcosistema">
            <h4>Comunidad · Comentarios</h4>
            <div class="valorEcosistema">${comentariosTotales}</div>
            <div class="detalleEcosistema">Interacciones visibles</div>
        </div>
    `;

    if(promociones.length === 0){
        promocionesEl.innerHTML = "<span class='chipPromocionComunidad'>Sin promociones activas por ahora</span>";
    }
    else{
        promocionesEl.innerHTML = promociones.map((promo)=>{
            return `<span class="chipPromocionComunidad">${promo.nombre} · ${promo.descuento}% en ${promo.categoria}</span>`;
        }).join("");
    }

    const productosEscaparate = productos
        .filter((p)=>p && p.estado !== "Inactivo")
        .slice(0,4);

    if(productosEscaparate.length === 0){
        productosEl.innerHTML = "<div class='sinComentarios'>No hay productos para mostrar en el escaparate.</div>";
        return;
    }

    productosEl.innerHTML = productosEscaparate.map((producto)=>{
        const promoProducto = promociones.find((promo)=>promo.categoria == producto.categoria);
        const precio = Number(producto.precio || 0);
        const precioFinal = promoProducto
            ? (precio - (precio * Number(promoProducto.descuento || 0) / 100)).toFixed(2)
            : precio.toFixed(2);

        return `
            <div class="miniProductoComunidad">
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <h4>${producto.nombre}</h4>
                <p>${producto.categoria || "General"}</p>
                <p class="precioPromo">$${precioFinal}</p>
                <a class="btnVerMasComunidad" href="detalleProducto.html?nombre=${encodeURIComponent(producto.nombre)}">Ver detalle</a>
            </div>
        `;
    }).join("");

}


//==========================================
// FORMULARIO COMUNIDAD
//==========================================

function cargarFormulario(){

    const formulario =
    document.getElementById("formComentario");

    if(!formulario){

        return;

    }

    if(usuario){

        formulario.innerHTML = `

            <div class="nuevoComentario">

                <textarea

                    id="comentarioComunidad"

                    rows="4"

                    placeholder="¿Qué quieres compartir con la comunidad?">

                </textarea>

                <br><br>

                <button

                    class="boton"

                    onclick="publicarComentario()">

                    Publicar comentario

                </button>

            </div>

        `;

    }

    else{

        formulario.innerHTML = `

            <div class="mensajeLogin">

                <h3>

                    🔒 Debes iniciar sesión

                </h3>

                <p>

                    Para comentar o responder publicaciones necesitas una cuenta.

                </p>

                <a

                    href="login.html"

                    class="boton">

                    Iniciar sesión

                </a>

            </div>

        `;

    }

}

//==========================================
// PUBLICAR RESEÑA
//==========================================

function publicarResena(){

    if(!usuario){

        mostrarConfirmacion(

            "Debes iniciar sesión para publicar una reseña.",

            ()=>{

                window.location.href="login.html";

            }

        );

        return;

    }

    const comentario =
    document.getElementById("comentario").value.trim();

    const estrellas =
    Number(document.getElementById("calificacion").value);

    if(comentario==""){

        mostrarToast(

            "Escribe una reseña.",

            "advertencia"

        );

        return;

    }

    const historial =
    JSON.parse(

        localStorage.getItem("historial")

    ) || [];

    const compro = historial.some(p=>{

        return p.cliente===usuario.nombre;

    });

    if(!compro){

        mostrarToast(

            "Solo clientes con compra pueden publicar reseñas.",

            "advertencia"

        );

        return;

    }

    resenas.unshift({

        id:Date.now(),

        usuario:usuario.nombre,

        comentario:comentario,

        estrellas:estrellas,

        fecha:new Date().toLocaleString(),

        utiles:0,

        compraVerificada:true

    });

    localStorage.setItem(

        "resenas",

        JSON.stringify(resenas)

    );

    document.getElementById("comentario").value="";

    mostrarToast(

        "⭐ Gracias por compartir tu experiencia.",

        "exito"

    );

    ordenarResenas();

    mostrarResenas();

}



//==========================================
// MOSTRAR RESEÑAS
//==========================================

function mostrarResenas(){

    const lista =

    document.getElementById("listaResenas");

    if(!lista){

        return;

    }

    lista.innerHTML="";

    if(resenas.length==0){

        lista.innerHTML=`

        <div class="sinComentarios">

            Todavía no hay reseñas.

            <br>

            ¡Sé el primero en compartir tu experiencia!

        </div>

        `;

        calcularPromedio();

        return;

    }

    resenas.forEach(r=>{

        let estrellas="";

        for(let i=1;i<=5;i++){

            estrellas +=

            i<=r.estrellas

            ?

            "⭐"

            :

            "☆";

        }

        lista.innerHTML += `

        <div class="cardResena">

            <div class="encabezadoComentario">

                <h3>

                    👤 ${r.usuario}

                </h3>

                <small>

                    ${r.fecha}

                </small>

            </div>

            ${

                r.compraVerificada

                ?

                '<span class="compraVerificada">✔ Compra verificada</span>'

                :

                ''

            }

            <div class="estrellasResena">

                ${estrellas}

            </div>

            <p>

                ${r.comentario}

            </p>

            <button

                class="btnLike"

                onclick="darLikeResena(${r.id})">

                👍 Útil (${r.utiles})

            </button>

        </div>

        `;

    });

    calcularPromedio();

}



//==========================================
// CALCULAR PROMEDIO
//==========================================

function calcularPromedio(){

    const numero =
    document.getElementById("promedioNumero");

    const cantidad =
    document.getElementById("cantidadResenas");

    const estrellas =
    document.getElementById("promedioEstrellas");

    if(resenas.length==0){

        numero.innerHTML="0.0";

        cantidad.innerHTML="Basado en 0 reseñas";

        estrellas.innerHTML="☆☆☆☆☆";

        return;

    }

    let suma=0;

    resenas.forEach(r=>{

        suma+=r.estrellas;

    });

    const promedio =

    (suma/resenas.length).toFixed(1);

    numero.innerHTML=promedio;

    cantidad.innerHTML=

    "Basado en "+resenas.length+" reseñas";

    let dibujo="";

    for(let i=1;i<=5;i++){

        dibujo +=

        i<=Math.round(promedio)

        ?

        "⭐"

        :

        "☆";

    }

    estrellas.innerHTML=dibujo;

}


// Ordenar reseñas: primero por útiles, luego por id (más reciente primero)
function ordenarResenas(){

    if(!resenas || !Array.isArray(resenas)) return;

    resenas.sort((a,b)=>{

        if((b.utiles||0) !== (a.utiles||0)){

            return (b.utiles||0) - (a.utiles||0);

        }

        return (b.id || 0) - (a.id || 0);

    });

    localStorage.setItem("resenas", JSON.stringify(resenas));

}

// Ordenar comentarios: primero por likes, luego por id (más reciente primero)
function ordenarComentarios(){

    if(!comentarios || !Array.isArray(comentarios)) return;

    comentarios.sort((a,b)=>{

        if((b.likes||0) !== (a.likes||0)){

            return (b.likes||0) - (a.likes||0);

        }

        return (b.id || 0) - (a.id || 0);

    });

    localStorage.setItem("comentariosComunidad", JSON.stringify(comentarios));

}



//==========================================
// LIKE RESEÑA
//==========================================

function darLikeResena(id){

    const indice =

    resenas.findIndex(r=>r.id==id);

    if(indice==-1){

        return;

    }

    resenas[indice].utiles++;

    localStorage.setItem(

        "resenas",

        JSON.stringify(resenas)

    );

    mostrarResenas();

}

//==========================================
// PUBLICAR COMENTARIO
//==========================================

function publicarComentario(){

    if(!usuario){

        mostrarConfirmacion(

            "Debes iniciar sesión para comentar.",

            ()=>{

                window.location.href="login.html";

            }

        );

        return;

    }

    const caja =
    document.getElementById("comentarioComunidad");

    const texto =
    caja.value.trim();

    if(texto==""){

        mostrarToast(

            "Escribe un comentario.",

            "advertencia"

        );

        return;

    }

    comentarios.unshift({

        id:Date.now(),

        usuario:usuario.nombre,

        comentario:texto,

        fecha:new Date().toLocaleString(),

        likes:0,

        respuestas:[]

    });

    localStorage.setItem(

        "comentariosComunidad",

        JSON.stringify(comentarios)

    );

    caja.value="";

    mostrarComentarios();

    mostrarToast(

        "Comentario publicado.",

        "exito"

    );

}



//==========================================
// MOSTRAR COMENTARIOS
//==========================================

function mostrarComentarios(){

    const lista =

    document.getElementById("listaComentarios");

    if(!lista){

        return;

    }

    lista.innerHTML="";

    if(comentarios.length==0){

        lista.innerHTML=`

        <div class="sinComentarios">

            Aún no hay comentarios.

            <br>

            ¡Sé el primero en participar!

        </div>

        `;

        return;

    }

    comentarios.forEach(c=>{

        if(!c.respuestas){

            c.respuestas=[];

        }

        let respuestasHTML="";

        c.respuestas.forEach(r=>{

            respuestasHTML +=`

            <div class="respuestaComentario">

                <div class="avatarRespuesta">

                    ${r.usuario.charAt(0).toUpperCase()}

                </div>

                <div class="contenidoRespuesta">

                    <strong>

                        👤 ${r.usuario}

                    </strong>

                    <small>

                        🕒 ${r.fecha}

                    </small>

                    <p>

                        ${r.comentario}

                    </p>

                    <button

                        class="btnLike"

                        onclick="darLikeRespuesta(${c.id},${r.id})">

                        👍 ${r.likes || 0}

                    </button>

                </div>

            </div>

            `;

        });

        lista.innerHTML +=`

        <div class="cardComentario" data-id="${c.id}">

            <div class="avatarComentario">

                ${c.usuario.charAt(0).toUpperCase()}

            </div>

            <div class="contenidoComentario">

                <div class="encabezadoComentario">

                    <h3>${c.usuario}</h3>

                    <small>${c.fecha}</small>

                </div>

                <p>

                    ${c.comentario}

                </p>

                <button

                    class="btnLike"

                    onclick="darLikeComentario(${c.id})">

                    👍 ${c.likes}

                </button>

                <button

                    class="btnResponder"

                    onclick="responderComentario(${c.id})">

                    💬 Responder

                </button>

                <div class="respuestasContainer">

                    ${respuestasHTML}

                </div>

            </div>

        </div>

        `;

    });

}



//==========================================
// LIKE COMENTARIO
//==========================================

function darLikeComentario(id){

    const indice =

    comentarios.findIndex(c=>c.id==id);

    if(indice==-1){

        return;

    }

    comentarios[indice].likes++;

    localStorage.setItem(

        "comentariosComunidad",

        JSON.stringify(comentarios)

    );

    mostrarComentarios();

}

//==========================================
// LIKE RESPUESTA
//==========================================

function darLikeRespuesta(idComentario,idRespuesta){

    const comentario =

    comentarios.find(

        c=>c.id==idComentario

    );

    if(!comentario){

        return;

    }

    const respuesta =

    comentario.respuestas.find(

        r=>r.id==idRespuesta

    );

    if(!respuesta){

        return;

    }

    respuesta.likes++;

    localStorage.setItem(

        "comentariosComunidad",

        JSON.stringify(comentarios)

    );

    mostrarComentarios();

}

//==========================================
// RESPONDER COMENTARIO
//==========================================

function responderComentario(id){

    if(!usuario){

        mostrarToast(

            "Debes iniciar sesión.",

            "advertencia"

        );

        return;

    }

    // localizar la tarjeta del comentario y evitar multiples formularios
    const tarjeta = document.querySelector('.cardComentario[data-id="'+id+'"]');
    if(!tarjeta) return;

    // eliminar cualquier formulario de respuesta existente
    const existente = document.querySelectorAll('.formRespuesta');
    existente.forEach(e=>e.remove());

    const cont = tarjeta.querySelector('.respuestasContainer') || tarjeta.querySelector('.contenidoComentario');

    const form = document.createElement('div');
    form.className = 'formRespuesta';
    form.style.marginTop = '12px';
    form.innerHTML = `
        <textarea placeholder="Escribe tu respuesta..." rows="3" class="inputRespuesta"></textarea>
        <div style="margin-top:8px; display:flex; gap:8px;">
            <button class="botonPublicarRes">Publicar respuesta</button>
            <button class="botonCancelarRes" style="background:#ddd; color:#111;">Cancelar</button>
        </div>
    `;

    cont.appendChild(form);

    const textarea = form.querySelector('.inputRespuesta');
    const btnPublicar = form.querySelector('.botonPublicarRes');
    const btnCancelar = form.querySelector('.botonCancelarRes');

    btnCancelar.addEventListener('click', ()=>{
        form.remove();
    });

    btnPublicar.addEventListener('click', ()=>{
        const texto = textarea.value.trim();
        if(texto==''){
            mostrarToast('Escribe una respuesta.', 'advertencia');
            return;
        }

        const comentario = comentarios.find(c=>c.id==id);
        if(!comentario) return;

        if(!comentario.respuestas) comentario.respuestas = [];

        comentario.respuestas.push({
            id: Date.now(),
            usuario: usuario.nombre,
            comentario: texto,
            fecha: new Date().toLocaleString(),
            likes: 0
        });

        localStorage.setItem('comentariosComunidad', JSON.stringify(comentarios));
        form.remove();
        mostrarComentarios();
        mostrarToast('Respuesta publicada.', 'exito');
    });

}

//==========================================
// NAVEGACION RAPIDA Y ANIMACIONES
//==========================================

function desplazarASeccion(idSeccion){

    const objetivo = document.getElementById(idSeccion);

    if(!objetivo){
        return;
    }

    objetivo.scrollIntoView({
        behavior:"smooth",
        block:"start"
    });

}

function inicializarNavegacionRapidaComunidad(){

    document.querySelectorAll("[data-scroll-target]").forEach((boton)=>{

        boton.addEventListener("click",()=>{

            const idObjetivo = boton.getAttribute("data-scroll-target");

            if(!idObjetivo){
                return;
            }

            desplazarASeccion(idObjetivo);

            const menuFlotante = document.getElementById("menuNavegacionFlotante");
            if(menuFlotante){
                menuFlotante.classList.remove("abierto");
                menuFlotante.setAttribute("aria-hidden","true");
            }

        });

    });

    const botonFlotante = document.getElementById("btnNavegacionFlotante");
    const menuFlotante = document.getElementById("menuNavegacionFlotante");

    if(!botonFlotante || !menuFlotante){
        return;
    }

    botonFlotante.addEventListener("click",()=>{

        const abierto = menuFlotante.classList.toggle("abierto");
        menuFlotante.setAttribute("aria-hidden", abierto ? "false" : "true");

    });

    document.addEventListener("click",(evento)=>{

        const clickDentroMenu = menuFlotante.contains(evento.target);
        const clickEnBoton = botonFlotante.contains(evento.target);

        if(!clickDentroMenu && !clickEnBoton){
            menuFlotante.classList.remove("abierto");
            menuFlotante.setAttribute("aria-hidden","true");
        }

    });

}

function inicializarAnimacionesComunidad(){

    const secciones = document.querySelectorAll(".seccionComunidad");

    if(secciones.length===0){
        return;
    }

    secciones.forEach((seccion)=>{
        seccion.classList.add("animarEntrada");
    });

    const observer = new IntersectionObserver((entradas)=>{

        entradas.forEach((entrada)=>{
            if(entrada.isIntersecting){
                entrada.target.classList.add("visible");
                observer.unobserve(entrada.target);
            }
        });

    },{
        threshold:0.15
    });

    secciones.forEach((seccion)=>observer.observe(seccion));

}

