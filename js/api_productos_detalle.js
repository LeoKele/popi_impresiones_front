// //! Datos de la API
// const API_SERVER = 'http://localhost:8080/apiproductos';
// const options = {
//     method: 'GET',
//     headers: {
//         accept: 'application/json'
//     }
// }

//Ruta del JSON 
const productosJSON = '../assets/json/productos_detalle.json'

const params = new URLSearchParams(window.location.search);
const productoId = params.get('id');


const cargarProducto = async (id = productoId) =>{
    try {
        // const response = await fetch(`${API_SERVER}/productos`, options);
        const response = await fetch(productosJSON); //Obtener archivo JSON local
        if (!response.ok){
            throw new Error('Error al cargar JSON')
        }
        const productos = await response.json();

        // const productos = await response.json(); // Convertimos la respuesta a JSON

        const ProductoElegido = binarySearchById(productos,id);
        // console.log(ProductoElegido);
        //const producto = procesarProducto(productos[id-1]);
        const producto = procesarProducto(ProductoElegido);

        // console.log(producto);

        // Verificar y asegurar que producto.imagenes sea siempre un array
        // producto.imagenes = Array.isArray(producto.imagenes) ? producto.imagenes : [];



        //*Creamos carousel con las imgs del producto
        const detalle_list = document.getElementById('carousel_detalle_list');
        detalle_list.innerHTML = '';

        const bullets_list = document.getElementById('bullets_carousel');
        bullets_list.innerHTML = '';

        for (let index = 0; index < producto[0].imagenes.length; index++) {
            const li = document.createElement('li');
            li.classList.add('glide__slide');

            const img = document.createElement('img');
            img.alt = producto.nombre;
            img.src = `../assets/img/productos/${id}_${index+1}.png`;

            detalle_list.appendChild(li);
            li.appendChild(img);
            
            //Creamos los bullets del carousel
            const btn = document.createElement('button');
            btn.classList.add('glide__bullet');
            btn.setAttribute('data-flide-dir', `=${index}`);

            bullets_list.appendChild(btn);

        }

        const config = {
            type: 'carousel',
            perView: 1,
            width: 30,
            focusAt: 'center',
            gap: 30
      
          };
          new Glide(".images",config).mount();


          //*Demas detalles
        //   const detalle = document.getElementById('detalle');
          const titulo = document.getElementById('titulo');
          titulo.textContent = producto[0].nombre;

          const descripcion = document.getElementById('descripcion');
          descripcion.textContent = producto[0].descripcion;

          const precio = document.getElementById('precio');
          precio.textContent = `$${producto[0].precio}`;

          const wspBtn = document.getElementById('wspBtn');
          wspBtn.href = `https://api.whatsapp.com/send?phone=+541133890751&text=Hola!,%20queria%20encargarte%20el%20producto%20%22${producto[0].nombre.replace(/ /g, "%20")}%22`;
          wspBtn.setAttribute('target','_blank');


    } catch (error) {
        console.log(error);
    }
}


//! Convertimos la cadena de imagenes del JSON en un array para adaptarla al codigo ya creado
function procesarProducto(productos) {
    if (!Array.isArray(productos)){
        productos = [productos];
    }
    return productos.map(producto => ({
        ...producto,
        imagenes: producto.imagenes ? producto.imagenes.split(',') : []
    }));
}

cargarProducto();


//! Buscamos la posicion en la que se encuentra el array con el id deseado
function binarySearchById(arr, targetId) {
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        let midId = parseInt(arr[mid].id);

        if (midId === parseInt(targetId)) {
            return arr[mid];
        } else if (midId < parseInt(targetId)) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return null; // Si no se encuentra el id
}
