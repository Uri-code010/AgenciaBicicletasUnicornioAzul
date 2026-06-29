let historial =
JSON.parse(localStorage.getItem("historial")) || [];

if(historial.length > 0){

    let compra = historial[historial.length-1];

    let numeroPedido =
    "UA-" +
    Date.now().toString().slice(-6);

    document.getElementById("detallePedido").innerHTML =

    `
        <p><strong>Pedido:</strong> ${numeroPedido}</p>

        <p><strong>Fecha:</strong> ${compra.fecha}</p>

        <p><strong>Método de Pago:</strong> ${compra.metodo}</p>

        <p><strong>Total:</strong> $${compra.total}</p>

        <p style="color:green; font-weight:bold;">

        🚲 Tu bicicleta pronto estará lista.

        </p>
    `;

}