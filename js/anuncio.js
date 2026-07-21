// Pantalla de entrada animada para anuncio.html.

document.addEventListener('DOMContentLoaded', () => {

    const intro = document.getElementById('intro');

    if(!intro) return; // Solo ejecutar en anuncio.html.

    const velocidadEl = document.getElementById('velocidad');
    const flash = document.getElementById('flash');
    const overlay = document.getElementById('publicidad');
    const btnEntrar = document.getElementById('entrar');
    const audio = document.getElementById('campana');

    let velocidad = 0;

    // Sube el velocímetro hasta mostrar la publicidad.
    const acc = setInterval(() => {
        velocidad += Math.floor(Math.random() * 8) + 4;
        if(velocidad > 80) velocidad = 80;
        if(velocidadEl) velocidadEl.textContent = velocidad + ' km/h';
        if(velocidad >= 60){
            clearInterval(acc);

            // Destello breve antes de revelar el overlay.
            if(flash){
                flash.classList.add('flash-on');
                setTimeout(()=> flash.classList.remove('flash-on'), 300);
            }

            if(overlay) overlay.classList.remove('oculto');

            // Reproduce el audio si el navegador lo permite.
            if(audio && typeof audio.play === 'function'){
                try{ audio.play(); }catch(e){}
            }
        }
    }, 120);

    // Lleva al sitio principal al hacer clic.
    if(btnEntrar){
        btnEntrar.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    // Autoredirección si ya se mostró la publicidad.
    setTimeout(() => {
        if(overlay && !overlay.classList.contains('oculto')){
            window.location.href = 'index.html';
        }
    }, 12000);

});