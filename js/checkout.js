let carrito =
JSON.parse(localStorage.getItem("carrito")) || [];

let resumen =
document.getElementById("resumenCompra");

let total = 0;

carrito.forEach(producto=>{

    resumen.innerHTML += `
        <p>

        ${producto.nombre}

        <strong>$${producto.precio}</strong>

        </p>
    `;

    total += producto.precio;

});

document.getElementById("totalCompra").innerHTML =
"Total: $" + total;



document.getElementById("formCheckout")
.addEventListener("submit",function(e){

e.preventDefault();

let compra={

cliente:

document.getElementById("nombre").value,

direccion:

document.getElementById("direccion").value,

telefono:

document.getElementById("telefono").value,

metodo:

document.getElementById("metodoPago").value,

productos:carrito,

total:total,

fecha:new Date().toLocaleString()

};



let historial=

JSON.parse(localStorage.getItem("historial")) || [];

historial.push(compra);

localStorage.setItem(

"historial",

JSON.stringify(historial)

);

localStorage.removeItem("carrito");

document.getElementById("mensajeCompra").innerHTML=

"✅ Compra realizada correctamente.";

setTimeout(()=>{

window.location.href="confirmacion.html";

},1200);

});