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

//========================================
// PROMOCIONES
//========================================

const promociones =

JSON.parse(

localStorage.getItem("promociones")

) || [];

// ========================================
// MOSTRAR PRODUCTOS DEL CARRITO
// ========================================

carrito.forEach(producto => {

    const cantidad =
    producto.cantidad || 1;

    let precio =
    producto.precio;

    const categoria =
    producto.categoria || "";

    const promo =

    promociones.find(p=>

        p.categoria == categoria

    );

    if(promo){

        precio =

        precio -

        (precio * promo.descuento /100);

    }

    subtotal +=

    precio * cantidad;

    resumen.innerHTML += `

    <p>

        🚲 ${producto.nombre}

        x${cantidad}

        <strong>

            $${(precio*cantidad).toFixed(2)}

        </strong>

    </p>

    `;


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

        mostrarToast("✅ Cupón aplicado correctamente.", "exito");

    }
    else {

        descuento = 0;

        mostrarToast("❌ Cupón inválido.", "advertencia");

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

        mostrarToast("🛒 El carrito está vacío.", "info");

        return;

    }

    if (!document.getElementById("politica").checked) {

        mostrarToast("⚠ Debe aceptar la política de devoluciones.", "advertencia");

        return;

    }

    if (!document.getElementById("terminos").checked) {

        mostrarToast("⚠ Debe aceptar los términos y condiciones.", "advertencia");

        return;

    }

    const usuario =
        JSON.parse(
            localStorage.getItem("usuarioActual")
        ) || {};

    const pedido = {

        id: Date.now(),

        cliente: usuario.nombre || document.getElementById("nombre").value,

        correo: usuario.correo || "",

        fecha: new Date().toLocaleDateString(),

        productos: carrito,

        total: totalFinal,

        estado: "Pedido recibido"

    };

    const compra = {

        id: pedido.id,

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
    // Guardar pedidos
    // ==========================

    let pedidos =

        JSON.parse(

            localStorage.getItem("pedidos")

        ) || [];

    pedidos.push(pedido);

    localStorage.setItem(

        "pedidos",

        JSON.stringify(pedidos)

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

    mostrarToast(

        "🎉 Pedido realizado correctamente.",

        "exito"

    );

    // ==========================
    // Ir a confirmación
    // ==========================

    setTimeout(function () {

        window.location.href = "confirmacion.html";

    }, 1200);

});