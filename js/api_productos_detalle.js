// //! Datos de la API
// const API_SERVER = 'http://localhost:8080/apiproductos';
// const options = {
//     method: 'GET',
//     headers: {
//         accept: 'application/json'
//     }
// }

//Ruta del JSON 
const productosJSON = '../assets/productos_detalle.json'

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
        console.log(productos);

        // const productos = await response.json(); // Convertimos la respuesta a JSON


        //*Busqueda del producto
        //*(lo mejor seria que el api devuelva solo el producto requerido, no todos)
        const productoBuscado = buscarProductoPorId(id, productos);
        console.log(productoBuscado);

        const producto = procesarProducto(productoBuscado);
        console.log(producto);

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
            gap: 30,
            autoPlay: 'true'
      
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
          wspBtn.href = `https://api.whatsapp.com/send?phone=+541168461698&text=Hola!,%20queria%20encargarte%20el%20producto%20%22${producto[0].nombre.replace(/ /g, "%20")}%22`;
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


//! Realizamos una busqueda binaria para encontrar el producto que corresponde al id. 
function buscarProductoPorId(idBuscado, productosJson) {
    // productosJson.sort((a, b) => a.id - b.id);

    let inicio = 0;
    let fin = productosJson.length - 1;

    while (inicio <= fin) {
        const medio = Math.floor((inicio + fin) / 2);
        const productoActual = productosJson[medio];

        if (productoActual.id == idBuscado) {
            // Encontramos el producto, lo retornamos
            return productoActual;
        } else if (productoActual.id < idBuscado) {
            // El producto buscado está en la mitad derecha
            inicio = medio + 1;
        } else {
            // El producto buscado está en la mitad izquierda
            fin = medio - 1;
        }
    }

    // Si llegamos aquí, el producto no fue encontrado
    return null;
}


cargarProducto();