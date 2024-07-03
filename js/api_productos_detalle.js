//! Datos de la API
const API_SERVER = 'http://localhost:8080/apiproductos';
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json'
    }
}


const params = new URLSearchParams(window.location.search);
const productoId = params.get('id');


const cargarProducto = async (id = productoId) =>{
    try {
        const response = await fetch(`${API_SERVER}/productos`, options);

        const productos = await response.json(); // Convertimos la respuesta a JSON
        //*Busqueda del producto
        //*(lo mejor seria que el api devuelva solo el producto requerido, no todos)
        const producto = buscarProductoPorId(id, productos);
        console.log(producto);


        //*Creamos carousel con las imgs del producto
        const detalle_list = document.getElementById('carousel_detalle_list');
        detalle_list.innerHTML = '';

        const bullets_list = document.getElementById('bullets_carousel');
        bullets_list.innerHTML = '';

        for (let index = 0; index < producto.imagenes.length; index++) {
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
          titulo.textContent = producto.nombre;

          const descripcion = document.getElementById('descripcion');
          descripcion.textContent = producto.descripcion;

          const precio = document.getElementById('precio');
          precio.textContent = `$${producto.precio}`;

          const wspBtn = document.getElementById('wspBtn');

          wspBtn.href = `https://api.whatsapp.com/send?phone=+541168461698&text=Hola!,%20queria%20encargarte%20el%20producto%20%22${producto.nombre.replace(/ /g, "%20")}%22`;



    } catch (error) {
        console.log(error);
    }
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