const velocidad = document.getElementById("velocidad");
const intro = document.getElementById("intro");
const publicidad = document.getElementById("publicidad");
const flash = document.getElementById("flash");
const sonido = document.getElementById("campana");

let km = 0;

const intervalo = setInterval(() => {

    km += 5;

    velocidad.innerHTML = km + " km/h";

    if(km >= 100){

        clearInterval(intervalo);

        flash.classList.add("destello");

        if(sonido){
            sonido.play().catch(()=>{});
        }

        setTimeout(()=>{

            intro.style.display="none";

            publicidad.classList.remove("oculto");

            aparecerContenido();

        },500);

    }

},80);

function aparecerContenido(){

    const elementos =
    document.querySelectorAll(".animacion");

    elementos.forEach((item,i)=>{

        setTimeout(()=>{

            item.classList.add("visible");

        },i*700);

    });

}

console.log("publicidad.js cargado");
const botonEntrar = document.getElementById("entrar");
console.log("botonEntrar:", botonEntrar);
if (botonEntrar) {
    botonEntrar.addEventListener("click", () => {
        console.log("clic en entrar");
        window.location.href = "index.html";
    });
} else {
    console.log("No se encontró el botón #entrar en esta página.");
}