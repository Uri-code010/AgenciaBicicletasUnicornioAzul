//==========================================
// PUBLICACIONES
// Agencia de Bicicletas El Unicornio Azul
//==========================================


//==========================================
// VARIABLES
//==========================================

let publicaciones =

JSON.parse(

    localStorage.getItem("publicaciones")

) || [];

const usuarioPublicacion =

JSON.parse(

    localStorage.getItem("usuarioActual")

);


//==========================================
// INICIAR
//==========================================

document.addEventListener("DOMContentLoaded",()=>{

    cargarFormularioPublicacion();

    mostrarPublicaciones();

});
// No ejecutar `cambiarFormulario` antes de que el formulario exista; se inicializa después de renderizar el formulario.
//==========================================
// CAMPOS DINÁMICOS
//==========================================

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



//==========================================
// FORMULARIO
//==========================================

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

    // Inicializar campos dinámicos tras renderizar el formulario
    cambiarFormulario();

}

//==========================================
// PUBLICAR
//==========================================

function publicar(){

    const titulo =

    document.getElementById("tituloPublicacion").value.trim();

    const descripcion =

    document.getElementById("descripcionPublicacion").value.trim();

    const tipo =

    document.getElementById("tipoPublicacion").value;

    if(titulo=="" || descripcion==""){

        mostrarToast(

            "Completa toda la información.",

            "advertencia"

        );

        return;

    }

    publicaciones.unshift({

    id:Date.now(),

    tipo:tipo,

    usuario:usuarioPublicacion.nombre,

    titulo:titulo,

    descripcion:descripcion,

    fecha:new Date().toLocaleString(),

    likes:0,

    comentarios:[],

    precio:

        document.getElementById("precio")

        ?

        Number(document.getElementById("precio").value)

        :

        0,

    fechaFin:

        document.getElementById("fechaFin")

        ?

        document.getElementById("fechaFin").value

        :

        "",

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

    localStorage.setItem(

        "publicaciones",

        JSON.stringify(publicaciones)

    );

    mostrarToast(

        "Publicación creada.",

        "exito"

    );

    mostrarPublicaciones();

    // Limpiar campos del formulario tras publicar
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

//==========================================
// MOSTRAR
//==========================================

function mostrarPublicaciones(){

    const lista =

    document.getElementById("listaPublicaciones");

    if(!lista){

        return;

    }

    lista.innerHTML="";

    publicaciones.forEach(p=>{

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

// ==========================
// Lógica para anuncio.html
// ==========================

document.addEventListener('DOMContentLoaded', () => {

    const intro = document.getElementById('intro');

    if(!intro) return; // Sólo ejecutar en anuncio.html

    const velocidadEl = document.getElementById('velocidad');
    const flash = document.getElementById('flash');
    const overlay = document.getElementById('publicidad');
    const btnEntrar = document.getElementById('entrar');
    const audio = document.getElementById('campana');

    let velocidad = 0;

    // Animar velocímetro hasta mostrar la publicidad
    const acc = setInterval(() => {
        velocidad += Math.floor(Math.random() * 8) + 4;
        if(velocidad > 80) velocidad = 80;
        if(velocidadEl) velocidadEl.textContent = velocidad + ' km/h';
        if(velocidad >= 60){
            clearInterval(acc);
            // efecto flash y mostrar overlay
            if(flash){
                flash.classList.add('flash-on');
                setTimeout(()=> flash.classList.remove('flash-on'), 300);
            }
            if(overlay) overlay.classList.remove('oculto');
            if(audio && typeof audio.play === 'function'){
                try{ audio.play(); }catch(e){}
            }
        }
    }, 120);

    // Botón entrar
    if(btnEntrar){
        btnEntrar.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    // Auto entrar después de 12 segundos si existe overlay visible
    setTimeout(() => {
        if(overlay && !overlay.classList.contains('oculto')){
            window.location.href = 'index.html';
        }
    }, 12000);

});