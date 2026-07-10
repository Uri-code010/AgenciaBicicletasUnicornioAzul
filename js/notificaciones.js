//==============================
// NOTIFICACIONES
//==============================

function mostrarToast(mensaje,tipo="info"){

    const toast = document.createElement("div");

    toast.className =

    "toast " + tipo;

    toast.innerHTML = mensaje;

    document.body.appendChild(toast);

    setTimeout(()=>{

        toast.classList.add("mostrar");

    },100);

    setTimeout(()=>{

        toast.classList.remove("mostrar");

    },3000);

    setTimeout(()=>{

        toast.remove();

    },3400);

}

function mostrarConfirmacion(mensaje, onConfirm, onCancel){

    const overlay = document.createElement("div");

    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(0,0,0,0.35)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = "9999";

    const modal = document.createElement("div");

    modal.style.background = "#fff";
    modal.style.padding = "20px";
    modal.style.borderRadius = "12px";
    modal.style.boxShadow = "0 8px 20px rgba(0,0,0,0.2)";
    modal.style.maxWidth = "320px";
    modal.style.width = "90%";
    modal.style.textAlign = "center";

    modal.innerHTML = `

        <p style="margin:0 0 15px; font-weight:bold;">${mensaje}</p>

        <div style="display:flex; justify-content:center; gap:10px;">

            <button style="padding:8px 14px; border:none; border-radius:8px; background:#0d6efd; color:#fff; cursor:pointer;" class="confirmar">Sí</button>

            <button style="padding:8px 14px; border:none; border-radius:8px; background:#6c757d; color:#fff; cursor:pointer;" class="cancelar">No</button>

        </div>

    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    overlay.querySelector(".confirmar").addEventListener("click", ()=>{

        overlay.remove();

        if(onConfirm) onConfirm();

    });

    overlay.querySelector(".cancelar").addEventListener("click", ()=>{

        overlay.remove();

        if(onCancel) onCancel();

    });

}