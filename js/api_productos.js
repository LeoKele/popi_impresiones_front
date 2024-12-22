document.addEventListener("DOMContentLoaded", async function() {
    // Ruta de los JSON
    const productosJSON = '../assets/json/productos_index.json';
    const categoriasJSON = '../assets/json/categorias.json';
    
    const categoriasSelect = document.getElementById("categoriaSelect");
    const productosSection = document.getElementById("productosSection");
    const resetFilterBtn = document.getElementById("resetFilterBtn");

    try {
        // Cargar categorías
        const categoriasResponse = await fetch(categoriasJSON);
        if (!categoriasResponse.ok) {
            throw new Error('Error al cargar JSON de categorías');
        }
        const categorias = await categoriasResponse.json();

        // Poblar el select con las categorías
        categorias.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria.id;
            option.textContent = categoria.descripcion;
            categoriasSelect.appendChild(option);
        });


        // Cargar productos
        const productosResponse = await fetch(productosJSON);
        if (!productosResponse.ok) {
            throw new Error('Error al cargar JSON de productos');
        }
        const productos = await productosResponse.json();

        //*Ordenamos productos por id de forma descendente
        productos.sort((a, b) => b.id - a.id);
        // Poblar la sección de productos inicialmente
        productos.forEach(producto => {
            const productoCard = crearTarjetaProducto(producto);
            productosSection.appendChild(productoCard);
        });

        // Filtrar productos por categoría
        categoriasSelect.addEventListener("change", function() {
            const categoriaSelect = this.value;
            filtrarProductosPorCategoria(categoriaSelect, productos);
        });

        // Restablecer filtro y mostrar todos los productos
        resetFilterBtn.addEventListener("click", function() {
            categoriasSelect.value = ""; // Restablecer el select
            productosSection.innerHTML = ""; // Limpiar la sección de productos
            // Mostrar todos los productos nuevamente
            productos.forEach(producto => {
                const productoCard = crearTarjetaProducto(producto);
                productosSection.appendChild(productoCard);
            });
        });

    } catch (error) {
        console.error(error);
    }
});

// Función para crear una tarjeta de producto
function crearTarjetaProducto(producto) {
    const card = document.createElement('div');
    card.classList.add('col-sm-12', 'col-md-6', 'col-lg-4', 'mb-sm-0', 'my-3');

    const cardInner = document.createElement('a');
    cardInner.classList.add('card');
    cardInner.href = `pages/detalle.html?id=${producto.id}`;
    cardInner.addEventListener('click', function() {
        gtag('event', 'click', {
            'event_category': 'Producto',
            'event_label': producto.nombre
        });
    });

    const cardImg = document.createElement('img');
    cardImg.classList.add('card-img', 'img-fluid');
    cardImg.src = `assets/img/productos/${producto.imagen}`;
    cardImg.alt = producto.nombre;
    cardImg.loading = 'lazy';
    cardImg.style.objectFit = 'cover'; // Asegura que la imagen se ajuste a la tarjeta
    cardImg.style.height = '300px'; // Ajusta esta altura según tus necesidades

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-img-overlay');

    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('position-absolute', 'top-50', 'start-50', 'translate-middle', 'fs-3');
    cardTitle.textContent = producto.nombre;

    cardBody.appendChild(cardTitle);
    cardInner.appendChild(cardImg);
    cardInner.appendChild(cardBody);
    card.appendChild(cardInner);

    return card;
}

// Función para crear una tarjeta de Instagram
function crearTarjetaInstagram(instagramUrl) {
    const card = document.createElement('div');
    card.classList.add('col-sm-12', 'col-md-6', 'col-lg-4', 'mb-sm-0', 'my-3');

    const cardInner = document.createElement('div');
    cardInner.classList.add('card', 'card-instagram');

    const instagramEmbed = document.createElement('blockquote');
    instagramEmbed.classList.add('instagram-media');
    instagramEmbed.setAttribute('data-instgrm-captioned', '');
    instagramEmbed.setAttribute('data-instgrm-permalink', instagramUrl);
    instagramEmbed.setAttribute('data-instgrm-version', '14');
    
    // Simplified styling for better embedding
    instagramEmbed.style.background = 'transparent';
    instagramEmbed.style.border = 'none';
    instagramEmbed.style.padding = '0';
    instagramEmbed.style.width = '100%';

    cardInner.appendChild(instagramEmbed);
    card.appendChild(cardInner);

    return card;
}

// Función para filtrar productos por categoría
function filtrarProductosPorCategoria(categoriaId, productos) {
    // Limpiar las tarjetas existentes
    const productosSection = document.getElementById("productosSection");
    productosSection.innerHTML = "";

    // Filtrar productos por categoría
    const productosFiltrados = productos.filter(producto => producto.idCategoria == categoriaId);

    // Crear tarjetas para los productos filtrados
    productosFiltrados.forEach(producto => {
        const card = crearTarjetaProducto(producto);
        productosSection.appendChild(card);
    });
}
