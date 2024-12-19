let productos = []; // Declarar variable global para almacenar los productos

// Función principal para cargar productos y configurar la aplicación
async function inicializarApp() {
    try {
        const respuesta = await fetch("./productos.json");
        if (!respuesta.ok) {
            throw new Error("No se pudo cargar productos.json");
        }
        productos = await respuesta.json(); // Guardar los productos en la variable global
        console.log("Productos cargados:", productos);

        // Llamar funciones que dependen de los productos
        mostrarProductos(productos);
        configurarEventos(); // Configurar eventos de búsqueda y carrito
    } catch (error) {
        console.error("Error al cargar productos:", error);
    }
}

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

// Configurar eventos de búsqueda y carrito
function configurarEventos() {
    // Filtros de búsqueda
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
        window.location.href = "carrito.html"; // Redirigir a la página del carrito
    });

    // Agregar producto al carrito
    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("agregar-carrito")) {
            const idProducto = Number(event.target.dataset.id);
            let carrito = cargarCarrito();
            carrito = actualizarCarrito(carrito, productos, idProducto);
            guardarCarrito(carrito);

            // Mostrar alerta con SweetAlert
            Swal.fire({
                title: '¡Éxito!',
                text: 'Producto agregado al carrito.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const carrito = cargarCarrito(); // Cargar el carrito desde LocalStorage
    mostrarCarrito(carrito); // Mostrar el carrito
    manejarEventosCarrito(carrito); // Configurar los eventos para el carrito
});

// Mostrar el carrito en la página del carrito
function mostrarCarrito(carrito) {
    const contenedorCarrito = document.getElementById("ver-carrito");
    const totalAPagar = document.getElementById("total-a-pagar");
    contenedorCarrito.innerHTML = ""; // Limpiar contenido previo

    if (carrito.length === 0) {
        // Mostrar mensaje si el carrito está vacío
        contenedorCarrito.innerHTML = "<p>El carrito está vacío.</p>";
        totalAPagar.innerText = "Total: $0";
        return;
    }

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

// Mostrar el carrito en la página del carrito
function mostrarCarrito(carrito) {
    const contenedorCarrito = document.getElementById("carrito");
    const totalAPagar = document.getElementById("total-a-pagar");
    contenedorCarrito.innerHTML = ""; // Limpiar contenido previo

    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = "<p>El carrito está vacío.</p>";
        totalAPagar.innerText = "Total: $0";
        return;
    }

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

// Configurar eventos en la página del carrito
function manejarEventosCarrito(carrito) {
    const contenedorCarrito = document.getElementById("carrito");

    contenedorCarrito.addEventListener("click", (event) => {
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


    document.getElementById("volver-tienda").addEventListener("click", () => {
        window.location.href = "index.html"; // Redirigir a la página de inicio.
    });

    document.getElementById("finalizar-compra").addEventListener("click", () => {
        alert("Compra finalizada. Gracias por preferirnos.");
        localStorage.removeItem("carrito");
        window.location.href = "index.html";
    });
}

// Funciones del carrito
function guardarCarrito(carrito) {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function cargarCarrito() {
    return JSON.parse(localStorage.getItem("carrito")) || [];
}

// Actualizar carrito con cantidad variable y stock
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
    productoBuscado.stock -= cantidad; // Actualizar el stock
    return carrito;
}

// Inicializar la aplicación al cargar la página
document.addEventListener("DOMContentLoaded", inicializarApp);
