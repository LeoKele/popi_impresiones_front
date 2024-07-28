//! Datos de la API
// const API_SERVER = 'http://localhost:8080/apiproductos';
// const options = {
//     method: 'GET',
//     headers: {
//         accept: 'application/json'
//     }
// }

//Ruta del JSON 
const productosJSON = '../assets/json/productos_index.json'

//! Función cargar productos
const cargarProductos = async () =>{
    try {
        // const response = await fetch(`${API_SERVER}/productos`, options);
        // console.log(response);

        const response = await fetch(productosJSON); //Obtener archivo JSON local
        if (!response.ok){
            throw new Error('Error al cargar JSON')
        }
        const productos = await response.json();
        console.log(productos);
        
        // const productos = await response.json(); // Convertimos la respuesta a JSON
        // console.log(productos);

        const productosSection = document.getElementById('productosSection');
        productosSection.innerHTML= '';

        productos.forEach(producto =>{
            
            const productoCard = crearTarjetaProducto(producto);
            productosSection.appendChild(productoCard);
        })

    } catch (error) {
        console.error(error);
    }
}

//! Función crear tarjeta producto
function crearTarjetaProducto(producto){
    const card = document.createElement('div');
    card.classList.add('col-sm-12','col-md-6','col-lg-4','mb-sm-0','my-3');

    const cardInner = document.createElement('a');
    cardInner.classList.add('card');
    cardInner.href = `pages/detalle.html?id=${producto.id}`;
    cardInner.addEventListener('click', function(){
        gtag('event','click',{
            'event_category':'Producto',
            'event_label': producto.nombre
        });
    });

    const cardImg = document.createElement('img');
    cardImg.classList.add('card-img', 'img-fluid');
    // cardImg.src = `assets/img/productos/${producto.imagenes[0]}`;
    cardImg.src = `assets/img/productos/${producto.imagen}`;
    cardImg.alt = producto.nombre;
    cardImg.loading = 'lazy';

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-img-overlay');

    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('position-absolute','top-50','start-50','translate-middle','fs-3');
    cardTitle.textContent = producto.nombre;

    //Añadimos los elementos a la tarjeta
    cardBody.appendChild(cardTitle);
    cardInner.appendChild(cardImg);
    cardInner.appendChild(cardBody);
    //Agrego tarjeta a la columna de bootstrap
    card.appendChild(cardInner);

    return card;

}





document.addEventListener("DOMContentLoaded",()=>{ cargarProductos()});