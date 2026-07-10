//===============================
// PROMOCIONES
//===============================

let promociones =

JSON.parse(

localStorage.getItem("promociones")

) || [];

const tabla =
document.getElementById("tablaPromociones");
const formPromocion = document.getElementById("formPromocion");
const nombrePromo = document.getElementById("nombrePromo");
const descuentoPromo = document.getElementById("descuentoPromo");
const categoriaPromo = document.getElementById("categoriaPromo");
const indicePromoEditar = document.getElementById("indicePromoEditar");
const cancelarEdicionPromo = document.getElementById("cancelarEdicionPromo");

mostrarPromociones();

//===============================
// MOSTRAR
//===============================

function mostrarPromociones(){

    tabla.innerHTML="";

    promociones.forEach((promo,indice)=>{

        tabla.innerHTML += `

        <tr>

            <td>

                ${promo.nombre}

            </td>

            <td>

                ${promo.descuento}%

            </td>

            <td>

                ${promo.categoria}

            </td>

            <td>

                <button
                onclick="editarPromocion(${indice})"
                style="margin-right:8px;">

                ✏ Editar

                </button>

                <button
                onclick="eliminarPromocion(${indice})">

                🗑 Eliminar

                </button>

            </td>

        </tr>

        `;

    });

}

//===============================
// GUARDAR
//===============================

formPromocion.addEventListener("submit",function(e){

    e.preventDefault();

    const indice = indicePromoEditar.value;

    const promoActualizada = {

        nombre: nombrePromo.value,

        descuento: Number(descuentoPromo.value),

        categoria: categoriaPromo.value

    };

    if(indice !== ""){

        promociones[Number(indice)] = promoActualizada;

    } else {

        promociones.push(promoActualizada);

    }

    localStorage.setItem(

        "promociones",

        JSON.stringify(promociones)

    );

    mostrarPromociones();
    this.reset();
    resetearFormularioPromocion();

});

function editarPromocion(indice){

    const promo = promociones[indice];

    nombrePromo.value = promo.nombre;
    descuentoPromo.value = promo.descuento;
    categoriaPromo.value = promo.categoria;
    indicePromoEditar.value = indice;
    cancelarEdicionPromo.style.display = "inline-block";

}

function resetearFormularioPromocion(){

    indicePromoEditar.value = "";
    cancelarEdicionPromo.style.display = "none";

}

cancelarEdicionPromo.addEventListener("click", function(){

    formPromocion.reset();
    resetearFormularioPromocion();

});

//===============================
// ELIMINAR
//===============================

function eliminarPromocion(indice){

    promociones.splice(indice,1);

    localStorage.setItem(

        "promociones",

        JSON.stringify(promociones)

    );

    mostrarPromociones();

}