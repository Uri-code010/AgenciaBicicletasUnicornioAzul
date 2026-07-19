const pedido =

    JSON.parse(

    localStorage.getItem("ultimaCompra")

    );

    const contenedor =

    document.getElementById("infoPedido");

    if(pedido){

        contenedor.innerHTML=`

            <p>

                <b>Pedido:</b>

                #${pedido.id}

            </p>

            <p>

                <b>Fecha:</b>

                ${new Date(pedido.fecha).toLocaleString("es-MX")}

            </p>

            <p>

            <b>Estado:</b>

                🟡 Pedido recibido

            </p>

            <h2>

                Total pagado

            </h2>

            <h1>

                $${Number(pedido.total).toFixed(2)}

            </h1>

        `;

    }