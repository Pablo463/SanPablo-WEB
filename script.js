// Array que representa el carrito de compras
let carrito = [];

// Función para guardar el carrito en localStorage
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Función para cargar el carrito desde localStorage
function cargarCarrito() {
    const carritoGuardado = localStorage.getItem("carrito");
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        mostrarCarrito(); // Actualizar la visualización del carrito
    }
}

// Función para agregar un producto al carrito
function agregarAlCarrito(nombreProducto, precioProducto) {
    const productoExistente = carrito.find(item => item.nombre === nombreProducto);


    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        const nuevoProducto = {
            nombre: nombreProducto,
            precio: precioProducto,
            cantidad: 1
        };
        carrito.push(nuevoProducto);
    }


    guardarCarrito();
    mostrarCarrito();


    // Mensaje de confirmación opcional
    alert(`Se ha agregado "${nombreProducto}" al carrito.`);
}

// Array de productos para la página principal
const productos = [
    { id: 1, nombre: "Álbum de Recuerdos", precio: 20, imagen: "album.jpg", descripcion: "Álbum de fotos para capturar momentos inolvidables" },
    { id: 2, nombre: "Marco de Fotos Digital", precio: 50, imagen: "marco_digital.jpg", descripcion: "Marco digital para mostrar tus fotos favoritas" },
    { id: 3, nombre: "Tarjetas de Mensajes", precio: 10, imagen: "tarjetas.jpg", descripcion: "Tarjetas para enviar mensajes especiales" },
    { id: 4, nombre: "Fotografía Impresa", precio: 5, imagen: "foto_impresa.jpg", descripcion: "Foto impresa de alta calidad" },
    { id: 5, nombre: "Pack de Imágenes Personalizadas", precio: 30, imagen: "pack_imagenes.jpg", descripcion: "Pack de imágenes personalizadas para regalar" },
    { id: 6, nombre: "Calendario Familiar", precio: 25, imagen: "calendario.jpg", descripcion: "Calendario con fotos de la familia" },
    { id: 7, nombre: "Caja de Recuerdos", precio: 40, imagen: "caja_recuerdos.jpg", descripcion: "Caja especial para guardar recuerdos" }
];

// Función para mostrar los productos en la página principal
function mostrarProductos() {
    const listaProductos = document.getElementById("listaProductos");

    productos.forEach(producto => {
        const productoElemento = document.createElement("div");
        productoElemento.classList.add("producto-item");
        
        productoElemento.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h4>${producto.nombre}</h4>
            <p>${producto.descripcion}</p>
            <p><strong>Precio: $${producto.precio}</strong></p>
            <button onclick="agregarAlCarrito('${producto.nombre}', ${producto.precio})">Agregar al Carrito</button>
        `;

        listaProductos.appendChild(productoElemento);
    });
}

// Llamar a la función para mostrar productos al cargar la página
document.addEventListener("DOMContentLoaded", mostrarProductos);

document.addEventListener("DOMContentLoaded", () => {
    const botonComprar = document.getElementById("botonComprar");
    const totalPago = document.getElementById("totalPago");
    const confirmarPago = document.getElementById("confirmarPago");

    // Deshabilitar el botón "Comprar" si el carrito está vacío
    function actualizarBotonComprar() {
        if (botonComprar) {
            if (carrito.length === 0) {
                botonComprar.disabled = true;
                botonComprar.classList.add("disabled");
            } else {
                botonComprar.disabled = false;
                botonComprar.classList.remove("disabled");
            }
        } else {
            console.error("Elemento con id 'botonComprar' no encontrado en el DOM.");
        }
    }

    // Llama a la función al cargar la página
    actualizarBotonComprar();

    // Mostrar el total a pagar en el modal cuando se abre
    if (botonComprar) {
        botonComprar.addEventListener("click", () => {
            const total = carrito.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0);
            if (totalPago) totalPago.textContent = `$${total.toFixed(2)}`;
        });
    }

    // Manejar la confirmación del pago
    if (confirmarPago) {
        confirmarPago.addEventListener("click", () => {
            const numeroTarjeta = document.getElementById("numeroTarjeta").value;
            const fechaExpiracion = document.getElementById("fechaExpiracion").value;
            const cvc = document.getElementById("cvc").value;
            const nombreTarjeta = document.getElementById("nombreTarjeta").value;

            if (numeroTarjeta && fechaExpiracion && cvc && nombreTarjeta) {
                alert("¡Gracias por tu compra! El pedido ha sido confirmado.");
                carrito = []; // Vaciar el carrito después de la compra
                mostrarCarrito(); // Actualizar la visualización del carrito
                guardarCarrito(); // Guardar el carrito vacío en localStorage
                actualizarBotonComprar(); // Actualizar el estado del botón "Comprar"
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalPago'));
                if (modal) modal.hide();
            } else {
                alert("Por favor, completa todos los campos del formulario.");
            }
        });
    } else {
        console.error("Elemento con id 'confirmarPago' no encontrado en el DOM.");
    }

    // Validaciones de entrada para el formulario de pago
    const numeroTarjetaInput = document.getElementById("numeroTarjeta");
    if (numeroTarjetaInput) {
        numeroTarjetaInput.addEventListener("input", function () {
            this.value = this.value.replace(/\D/g, ''); // Permitir solo dígitos
        });
    }

    const fechaExpiracionInput = document.getElementById("fechaExpiracion");
    if (fechaExpiracionInput) {
        fechaExpiracionInput.addEventListener("input", function () {
            let value = this.value.replace(/\D/g, ''); // Permitir solo dígitos
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4); // Insertar "/"
            }
            this.value = value;
        });
    }

    const cvcInput = document.getElementById("cvc");
    if (cvcInput) {
        cvcInput.addEventListener("input", function () {
            this.value = this.value.replace(/\D/g, '').slice(0, 3); // Solo dígitos y máx. 3 caracteres
        });
    }

    const nombreTarjetaInput = document.getElementById("nombreTarjeta");
    if (nombreTarjetaInput) {
        nombreTarjetaInput.addEventListener("input", function () {
            this.value = this.value.replace(/[^a-zA-Z\s]/g, ''); // Permitir solo letras y espacios
        });
    }
});



// Función para mostrar el contenido del carrito en carrito.html con botones de cantidad
function mostrarCarrito() {
    const contenidoCarrito = document.getElementById("contenidoCarrito");
    if (!contenidoCarrito) return; // Salir si no estamos en carrito.html

    contenidoCarrito.innerHTML = ""; // Limpiar el contenido actual
    carrito.forEach((producto, index) => {
        const productoElemento = document.createElement("div");
        productoElemento.classList.add("producto-carrito");

        productoElemento.innerHTML = `
            ${producto.nombre} - $${producto.precio} x ${producto.cantidad} = $${producto.precio * producto.cantidad}
            <button onclick="aumentarCantidad(${index})">+</button>
            <button onclick="disminuirCantidad(${index})">-</button>
        `;

        const botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar";
        botonEliminar.addEventListener("click", () => {
            eliminarProducto(index);
        });

        productoElemento.appendChild(botonEliminar);
        contenidoCarrito.appendChild(productoElemento);
    });

    const total = carrito.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0);
    document.getElementById("totalCarrito").textContent = `Total: $${total}`;
}

// Función para aumentar la cantidad de un producto
function aumentarCantidad(index) {
    carrito[index].cantidad += 1;
    guardarCarrito();
    mostrarCarrito();
}

// Función para disminuir la cantidad de un producto
function disminuirCantidad(index) {
    if (carrito[index].cantidad > 1) {
        carrito[index].cantidad -= 1;
    } else {
        carrito.splice(index, 1); // Elimina el producto si la cantidad es 0
    }
    guardarCarrito();
    mostrarCarrito();
}

// Función para eliminar un producto del carrito
function eliminarProducto(index) {
    carrito.splice(index, 1);
    mostrarCarrito();
    guardarCarrito(); // Guardar en localStorage después de eliminar un producto
}

// Evento para vaciar el carrito
document.getElementById("vaciarCarrito")?.addEventListener("click", () => {
    carrito = [];
    mostrarCarrito();
    guardarCarrito(); // Guardar en localStorage después de vaciar el carrito
});

// Cargar el carrito al iniciar la página
cargarCarrito();
// Array de productos recomendados
const productosRecomendados = [
    { nombre: "Álbum de Recuerdos", precio: 20 },
    { nombre: "Marco de Fotos Digital", precio: 50 },
    { nombre: "Tarjetas de Mensajes", precio: 10 }
];

// Función para mostrar los productos recomendados en carrito.html
function mostrarProductosRecomendados() {
    const productosRecomendadosContainer = document.getElementById("productosRecomendados");
    if (!productosRecomendadosContainer) return; // Salir si no estamos en carrito.html

    productosRecomendados.forEach(producto => {
        const productoElemento = document.createElement("div");
        productoElemento.classList.add("producto-recomendado");
        
        productoElemento.innerHTML = `
            ${producto.nombre} - $${producto.precio}
            <button onclick="agregarAlCarrito('${producto.nombre}', ${producto.precio})">Agregar al Carrito</button>
        `;

        productosRecomendadosContainer.appendChild(productoElemento);
    });
}

// Llamar a la función para mostrar productos recomendados al cargar la página
mostrarProductosRecomendados();

// Seleccionar el formulario de contacto
const formularioContacto = document.querySelector("form");


// Evento para mostrar una alerta cuando se envíe el formulario
formularioContacto.addEventListener("submit", (event) => {
    event.preventDefault(); // Evitar que se envíe el formulario y recargue la página


    alert("¡Gracias! Tu mensaje ha sido enviado correctamente.");
   
    formularioContacto.reset(); // Limpiar el formulario después de enviar
});

function toggleMenu() {
    const navbar = document.getElementById("navbar").querySelector("ul");
    navbar.classList.toggle("show");
}
