//creación de carrito (ver carrito.html) al dar click en el botón "Agregar al carrito" de cada producto
 
// Función para agregar productos al carrito

function agregarCarrito(nombre, precio) {

    // Obtener carrito actual o crear uno vacío
    let carrito =
        JSON.parse(localStorage.getItem("carrito")) || [];

    // Agregar producto
    carrito.push({
        nombre: nombre,
        precio: precio
    });

    // Guardar nuevamente en localStorage
    localStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
    );

    // Mostrar mensaje visual
    const mensaje =
        document.getElementById("mensajeCarrito");

    if (mensaje) {

        mensaje.innerHTML =
            `🛒 ${nombre} agregado al carrito`;

        mensaje.style.opacity = "1";

        setTimeout(() => {
            mensaje.style.opacity = "0";
        }, 3000);
    }

}