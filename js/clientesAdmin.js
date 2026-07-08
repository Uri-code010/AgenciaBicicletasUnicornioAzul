//=========================================
// CLIENTES ADMIN
//=========================================

const tabla =
    document.getElementById("tablaClientes");

    const usuarios =
    obtenerUsuariosRegistrados();

    usuarios.forEach(usuario=>{

        tabla.innerHTML += `

        <tr>

            <td>

                ${usuario.nombre}

            </td>

            <td>

                ${usuario.correo}

            </td>

            <td>

                ${usuario.telefono || "Sin registrar"}

            </td>

            <td>

                <span class="estadoActivo">

                    🟢 Activo

                </span>

            </td>

        </tr>

        `;

    });


    //=========================================
    // BUSCADOR
    //=========================================

    document
    .getElementById("buscarCliente")
    .addEventListener("keyup",function(){

        const texto =
        this.value.toLowerCase();

        const filas =
        document.querySelectorAll("#tablaClientes tr");

        filas.forEach(fila=>{

            if(

                fila.innerText
                .toLowerCase()
                .includes(texto)

            ){

                fila.style.display="";

            }

            else{

                fila.style.display="none";

            }

        });

    }
);