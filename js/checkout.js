// ========================================
// CHECKOUT
// Agencia de Bicicletas El Unicornio Azul
// ========================================

// Obtener carrito del usuario
const carrito = obtenerCarrito();

const resumen = document.getElementById("resumenCompra");

let subtotal = 0;
let descuento = 0;
let totalFinal = 0;

// ========================================
// MOSTRAR PRODUCTOS DEL CARRITO
// ========================================

carrito.forEach(producto => {

    const cantidad = producto.cantidad || 1;

    const subtotalProducto =
        producto.precio * cantidad;

    resumen.innerHTML += `

        <p>

            🚲 ${producto.nombre}

            x${cantidad}

            <strong>$${subtotalProducto}</strong>

        </p>

    `;

    subtotal += subtotalProducto;

});

document.getElementById("subtotalCompra").innerHTML =
    "Subtotal: $" + subtotal.toFixed(2);

document.getElementById("descuentoCompra").innerHTML =
    "Descuento: $0.00";

document.getElementById("envioCompra").innerHTML =
    "Envío: Gratis";

document.getElementById("totalCompra").innerHTML =
    "Total: $" + subtotal.toFixed(2);

totalFinal = subtotal;


// ========================================
// CUPÓN
// ========================================

function aplicarCupon() {

    const cupon =
        document.getElementById("cupon")
        .value
        .trim()
        .toUpperCase();

    if (cupon === "UNICORNIO10") {

        descuento = subtotal * 0.10;

        alert("✅ Cupón aplicado correctamente.");

    }
    else {

        descuento = 0;

        alert("❌ Cupón inválido.");

    }

    actualizarTotal();

}


// ========================================
// ACTUALIZAR TOTAL
// ========================================

function actualizarTotal() {

    const envio = Number(

        document.querySelector(
            'input[name="envio"]:checked'
        ).value

    );

    totalFinal =
        subtotal -
        descuento +
        envio;

    document.getElementById("descuentoCompra").innerHTML =
        "Descuento: $" + descuento.toFixed(2);

    document.getElementById("envioCompra").innerHTML =

        envio === 0

            ? "Envío: Gratis"

            : "Envío: $" + envio.toFixed(2);

    document.getElementById("totalCompra").innerHTML =

        "Total: $" + totalFinal.toFixed(2);

}


// ========================================
// CAMBIO DE ENVÍO
// ========================================

document
.querySelectorAll('input[name="envio"]')
.forEach(opcion => {

    opcion.addEventListener(

        "change",

        actualizarTotal

    );

});


// ========================================
// CONFIRMAR COMPRA
// ========================================

document
.getElementById("formCheckout")
.addEventListener("submit", function (e) {

    e.preventDefault();

    if (carrito.length === 0) {

        alert("El carrito está vacío.");

        return;

    }

    if (!document.getElementById("politica").checked) {

        alert("Debe aceptar la política de devoluciones.");

        return;

    }

    if (!document.getElementById("terminos").checked) {

        alert("Debe aceptar los términos y condiciones.");

        return;

    }

    const numeroPedido =
        "UA-" + Date.now();

    const compra = {

        id: numeroPedido,

        cliente:
            document.getElementById("nombre").value,

        direccion:
            document.getElementById("direccion").value,

        ciudad:
            document.getElementById("ciudad").value,

        codigoPostal:
            document.getElementById("cp").value,

        telefono:
            document.getElementById("telefono").value,

        metodo:
            document.getElementById("metodoPago").value,

        productos: carrito,

        subtotal: subtotal,

        descuento: descuento,

        envio: Number(

            document.querySelector(
                'input[name="envio"]:checked'
            ).value

        ),

        total: totalFinal,

        fecha:
            new Date().toLocaleString(),

        estado:
            "Pedido recibido"

    };

    // ==========================
    // Guardar historial
    // ==========================

    let historial =

        JSON.parse(

            localStorage.getItem("historial")

        ) || [];

    historial.push(compra);

    localStorage.setItem(

        "historial",

        JSON.stringify(historial)

    );

    // ==========================
    // Guardar último pedido
    // ==========================

    localStorage.setItem(

        "ultimaCompra",

        JSON.stringify(compra)

    );

    // ==========================
    // Vaciar carrito del usuario
    // ==========================

    vaciarCarrito(false);

    // ==========================
    // Mensaje
    // ==========================

    document.getElementById("mensajeCompra").innerHTML =

        "✅ Compra realizada correctamente.";

    // ==========================
    // Ir a confirmación
    // ==========================

    setTimeout(function () {

        window.location.href = "confirmacion.html";

    }, 1200);

});