// Mostrar productos en la página
function mostrarProductos(productos, filtroTexto = "", filtroDepartamento = "") {
    const contenedorProductos = document.getElementById("productos");
    contenedorProductos.innerHTML = ""; // Limpiar contenido previo

    productos
        .filter(producto =>
            (!filtroTexto || producto.nombre.toLowerCase().includes(filtroTexto.toLowerCase())) &&
            (!filtroDepartamento || producto.departamento === filtroDepartamento)
        )
        .forEach(producto => {
            const productoElemento = document.createElement("div");
            productoElemento.className = "producto";
            productoElemento.innerHTML = `
                <img src="images/${producto.rutaImagen}" alt="${producto.nombre}" class="producto-imagen" />
                <h3>${producto.nombre}</h3>
                <p>Precio: $${producto.precio}</p>
                <p>Stock: ${producto.stock}</p>
                <button data-id="${producto.id}" class="agregar-carrito">Agregar al carrito</button>
            `;
            contenedorProductos.appendChild(productoElemento);
        });
}

// Mostrar el carrito en la página del carrito
function mostrarCarrito(carrito) {
    const contenedorCarrito = document.getElementById("carrito");
    const totalAPagar = document.getElementById("total-a-pagar");
    contenedorCarrito.innerHTML = ""; // Limpiar contenido previo

    carrito.forEach(item => {
        const itemElemento = document.createElement("div");
        itemElemento.className = "item-carrito";
        itemElemento.innerHTML = `
            <p>${item.nombre} (x${item.unidades}) - Subtotal: $${item.subtotal}</p>
            <button data-id="${item.id}" class="incrementar">+</button>
            <button data-id="${item.id}" class="decrementar">-</button>
            <button data-id="${item.id}" class="eliminar">Eliminar</button>
        `;
        contenedorCarrito.appendChild(itemElemento);
    });

    const total = carrito.reduce((acc, item) => acc + item.subtotal, 0);
    totalAPagar.innerText = `Total: $${total}`;
}

// Guardar carrito en LocalStorage
function guardarCarrito(carrito) {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Cargar carrito desde LocalStorage
function cargarCarrito() {
    return JSON.parse(localStorage.getItem("carrito")) || [];
}

// Agregar eventos para manejar el carrito y navegación
function manejarEventos(productos) {
    document.getElementById("buscar").addEventListener("input", (event) => {
        const filtroTexto = event.target.value;
        const filtroDepartamento = document.getElementById("filtro-departamento").value;
        mostrarProductos(productos, filtroTexto, filtroDepartamento);
    });

    document.getElementById("filtro-departamento").addEventListener("change", (event) => {
        const filtroTexto = document.getElementById("buscar").value;
        const filtroDepartamento = event.target.value;
        mostrarProductos(productos, filtroTexto, filtroDepartamento);
    });

    document.getElementById("limpiar-filtros").addEventListener("click", () => {
        document.getElementById("buscar").value = "";
        document.getElementById("filtro-departamento").value = "";
        mostrarProductos(productos);
    });

    document.getElementById("ver-carrito").addEventListener("click", () => {
        window.location.href = "carrito.html";
    });

    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("agregar-carrito")) {
            const idProducto = Number(event.target.dataset.id);
            let carrito = cargarCarrito();
            carrito = actualizarCarrito(carrito, productos, idProducto);
            guardarCarrito(carrito);
            alert("Producto agregado al carrito.");
        }
    });
}

function manejarEventosCarrito(carrito, productos) {
    document.getElementById("volver-tienda").addEventListener("click", () => {
        window.location.href = "index.html";
    });

    document.getElementById("carrito").addEventListener("click", (event) => {
        const idProducto = Number(event.target.dataset.id);

        if (event.target.classList.contains("incrementar")) {
            carrito = actualizarCarrito(carrito, productos, idProducto, 1);
        } else if (event.target.classList.contains("decrementar")) {
            carrito = actualizarCarrito(carrito, productos, idProducto, -1);
        } else if (event.target.classList.contains("eliminar")) {
            carrito = carrito.filter(item => item.id !== idProducto);
        }

        guardarCarrito(carrito);
        mostrarCarrito(carrito);
    });

    document.getElementById("finalizar-compra").addEventListener("click", () => {
        alert("Compra finalizada. Gracias por preferirnos.");
        localStorage.removeItem("carrito");
        window.location.href = "index.html";
    });
}

// Actualizar carrito con cantidad variable
function actualizarCarrito(carrito, productos, idProducto, cantidad = 1) {
    const productoBuscado = productos.find(producto => producto.id === idProducto);
    if (!productoBuscado) return carrito;

    const productoEnCarrito = carrito.find(item => item.id === idProducto);
    if (productoEnCarrito) {
        productoEnCarrito.unidades += cantidad;
        if (productoEnCarrito.unidades <= 0) {
            carrito = carrito.filter(item => item.id !== idProducto);
        } else {
            productoEnCarrito.subtotal = productoEnCarrito.unidades * productoBuscado.precio;
        }
    } else if (cantidad > 0) {
        carrito.push({
            id: productoBuscado.id,
            nombre: productoBuscado.nombre,
            precio: productoBuscado.precio,
            unidades: cantidad,
            subtotal: productoBuscado.precio * cantidad,
        });
    }
    return carrito;
}

// Inicializar la aplicación
function inicializarApp() {
    const productos = [
        { id: 1, nombre: "Bicicleta spinning", precio: 5000, stock: 3, departamento: "deportes", rutaImagen:"BiciSpinning.png" },
        { id: 2, nombre: "Calza deportiva", precio: 7000, stock: 15, departamento: "deportes", rutaImagen:"CalzaDeportiva.png" },
        { id: 3, nombre: "Enterito burdeo", precio: 30000, stock: 20, departamento: "vestimenta", rutaImagen:"EnteritoBurdeo.png" },
        { id: 4, nombre: "Jeans claros", precio: 25000, stock: 8, departamento: "vestimenta", rutaImagen:"JeansClaros.png" },
        { id: 5, nombre: "The cow", precio: 8000, stock: 15, departamento: "libros", rutaImagen:"Libro01.jpg" },
        { id: 6, nombre: "Three Wishes", precio: 8000, stock: 15, departamento: "libros", rutaImagen:"Libro02.jpg" },
        { id: 7, nombre: "Summer of two wishes", precio: 15000, stock: 15, departamento: "libros", rutaImagen:"Libro03.jpg" },
        { id: 8, nombre: "Deception point", precio: 8000, stock: 15, departamento: "libros", rutaImagen:"Libro04.jpg" },
        { id: 9, nombre: "Angels and demons", precio: 6000, stock: 2, departamento: "libros", rutaImagen:"Libro05.jpg" },
        { id: 10, nombre: "Pantalón de buzo", precio: 15000, stock: 15, departamento: "deportes", rutaImagen:"PantalonBuzoGris.png" },
        { id: 11, nombre: "Polera flamencos", precio: 10000, stock: 3, departamento: "vestimenta", rutaImagen:"PoleraFlamencos.png" },
        { id: 12, nombre: "Polera cactus", precio: 8000, stock: 15, departamento: "vestimenta", rutaImagen:"PoleraCactus.png" },
        { id: 13, nombre: "Polerón costillas", precio: 8000, stock: 30, departamento: "vestimenta", rutaImagen:"PoleronCostillas.png" },
        { id: 14, nombre: "Polerón flores", precio: 18000, stock: 15, departamento: "vestimenta", rutaImagen:"PoleronFlores.png" },
        { id: 15, nombre: "Polerón mickey", precio: 25000, stock: 20, departamento: "vestimenta", rutaImagen:"PoleronMickey.png" },
        { id: 16, nombre: "Polerón morado", precio: 8000, stock: 4, departamento: "vestimenta", rutaImagen:"PoleronMorado.png" },
        { id: 17, nombre: "Vestido colores", precio: 16000, stock: 10, departamento: "vestimenta", rutaImagen:"VestidoColorpardo.jpg" },
        { id: 18, nombre: "Vestido fuccia", precio: 27000, stock: 4, departamento: "vestimenta", rutaImagen:"VestidoFuccia.png" },
        { id: 19, nombre: "Vestido negroverdenar", precio: 15000, stock: 15, departamento: "vestimenta", rutaImagen:"VestidoNevenara.png" },


    ];
    
    if (window.location.pathname.includes("index.html")) {
        mostrarProductos(productos);
        manejarEventos(productos);
    } else if (window.location.pathname.includes("carrito.html")) {
        const carrito = cargarCarrito();
        mostrarCarrito(carrito);
        manejarEventosCarrito(carrito, productos);
    }
}

document.addEventListener("DOMContentLoaded", inicializarApp);
