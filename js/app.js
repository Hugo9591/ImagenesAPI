const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacionDiv = document.querySelector('#paginacion');

const registrosPorPagina = 40;
let totalPaginas;
let iterador;

let paginaActual = 1;

window.onload = () => {
    formulario.addEventListener('submit', validarFormulario);
}

function validarFormulario(e){
    e.preventDefault();
    
    const terminoBusqueda = document.querySelector('#termino').value;

    //ValidarCampo
    if(terminoBusqueda === ''){
        mostrarAlerta('Agrega un Termino de Busqueda');

        return;
    }

    buscarImagenes(); 
}

function buscarImagenes(){
    const termino = document.querySelector('#termino').value;

    const key = '45811130-e6bcf47620c5ad29ca9bc3312';//Key de la APi
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`;//url de la API(se modifica sustiuyendo los valores key y terminos para hacerlo dinamico)

    fetch(url)
        .then( respuesta => respuesta.json())
        .then( resultado => {
            totalPaginas = calcularPaginas(resultado.totalHits)
            console.log(totalPaginas);
            mostrarImagenes(resultado.hits);
        })
}

function calcularPaginas(total){
    return parseInt(Math.ceil(total/registrosPorPagina));//Math.ceil() redondea hacia arriba para que no se quede ningun registro sin mostrar
}

function mostrarImagenes(imagenes){
    //Eliminar imagenes anteriores
    limpiarHTML(resultado);

    imagenes.forEach( imagen => {
        const { previewURL, likes, views, largeImageURL } = imagen;

        //Mostrar HTML
        resultado.innerHTML += `
                                <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                                    <div class="bg-white">
                                        <img class="w-full" src="${previewURL}">

                                        <div class="p-4">
                                            <p class="font-bold">${likes} <span class="font-light"> Me gusta </span></p>
                                            <p class="font-bold">${views} <span class="font-light"> Vistas </span></p>

                                            <a class=" block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1"
                                                href="${largeImageURL}" target="_blank" rel="noopener noreferrer">
                                                <!-- rel="noopener noreferrer para no tener problemas de seguridad al usar taget _blank-->
                                                Ver Imagen
                                            </a>
                                    </div>
                                </div>`;

    });
    
    limpiarHTML(paginacionDiv);

    imprimirPaginacion();
}


function limpiarHTML(elemento){
    while(elemento.firstChild){
        elemento.removeChild(elemento.firstChild);
    }
}

function *crearGenerador( total ){
    for(let i = 1; i <= total; i++){
        yield i;//devuelve el valor actual de i pero pausa la ejecucion hasta ser llamado de nuevo
    }
}

function imprimirPaginacion(){
    iterador = crearGenerador(totalPaginas);
    // console.log(iterador.next());

    while(true){
        const { value, done } = iterador.next();

        if(done) return;

        //caso contrario genera un boton por cada elemento en el generador
        const boton = document.createElement('a');
        boton.href = '#';
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('siguiente', 'bg-yellow-400', 'hover:bg-yellow-500', 'px-4', 'py-1', 'mr-2', 'font-bold', 'mb-4', 'rounded');


        boton.onclick = () =>{
            paginaActual = value;

            console.log(paginaActual);//Regresa el numero de la pagina que se hio click
            //No todas las APIs tiene paginacion si no la tienen sera mas dificl paginar
            buscarImagenes();
        }

        paginacionDiv.appendChild(boton);
        //Se vana  estar agregando los botones mientras la condicion sea true
    }
}


function mostrarAlerta(mensaje){

    const existeAlerta = document.querySelector('.bg-red-100');

    if(!existeAlerta){

        const alerta = document.createElement('P');
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center');

        alerta.innerHTML = `
                                <strong class="font-bold">Error!!!</strong>
                                <span class="block sm:inline">${mensaje}</span>
                            `;

        formulario.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}
