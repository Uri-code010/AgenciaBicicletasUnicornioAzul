//=========================================
// CLIENTES ADMIN
//=========================================

const API_CLIENTES = "http://localhost:4000/api/clientes"; // URL de la API para obtener los clientes 
const tabla = document.getElementById("tablaClientes");

async function cargarClientes() {
 
    try {
 
        const respuesta = await fetch(API_CLIENTES);
 
        if (!respuesta.ok) {
            throw new Error("No se pudo obtener la lista de clientes.");
        }
 
        const clientes = await respuesta.json();
 
        tabla.innerHTML = "";
 
        clientes.forEach(cliente => {
 
            const estadoHTML = cliente.estado === "activo"
                ? `<span class="estadoActivo">🟢 Activo</span>`
                : `<span class="estadoInactivo">🔴 Inactivo</span>`;
 
            tabla.innerHTML += `
 
            <tr>
 
                <td>
 
                    ${cliente.nombre}
 
                </td>
 
                <td>
 
                    ${cliente.correo}
 
                </td>
 
                <td>
 
                    ${cliente.telefono || "Sin registrar"}
 
                </td>
 
                <td>
 
                    ${estadoHTML}
 
                </td>
 
            </tr>
 
            `;
 
        });
 
    } catch (error) {
 
        console.error(error);
 
        tabla.innerHTML = `
            <tr>
                <td colspan="4">
                    No se pudieron cargar los clientes. Verifica que el backend esté corriendo (npm start).
                </td>
            </tr>
        `;
 
    }
 
}
 
cargarClientes();


    //=========================================
    // BUSCADOR
    //=========================================
// codigo para el buscador de clientes en la tabla
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