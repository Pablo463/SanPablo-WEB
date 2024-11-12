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


    mostrarCarrito();
    guardarCarrito(); // Guardar en localStorage cada vez que el carrito cambia
   
    // Mensaje de confirmación
    alert(`Se ha agregado "${nombreProducto}" al carrito.`);
}




// Función para mostrar el contenido del carrito en la página
function mostrarCarrito() {
    const contenidoCarrito = document.getElementById("contenidoCarrito");
    contenidoCarrito.innerHTML = ""; // Limpiar el contenido actual


    carrito.forEach((producto, index) => {
        const productoElemento = document.createElement("div");
        productoElemento.classList.add("producto-carrito");


        productoElemento.innerHTML = `${producto.nombre} - $${producto.precio} x ${producto.cantidad}`;
       
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


// Función para eliminar un producto del carrito
function eliminarProducto(index) {
    carrito.splice(index, 1);
    mostrarCarrito();
    guardarCarrito(); // Guardar en localStorage después de eliminar un producto
}


// Evento para vaciar el carrito
function vaciarCarrito() {
    carrito = [];
    mostrarCarrito();
    guardarCarrito(); // Guardar en localStorage después de vaciar el carrito
}


// Seleccionar el botón de compra y agregar evento
const botonComprar = document.querySelector("button");
botonComprar.addEventListener("click", () => {
    agregarAlCarrito("Pack de Fotos y Regalos", 30);
});


// Cargar el carrito al iniciar la página
cargarCarrito();


// Función para mostrar el resumen del pedido
function mostrarResumenPedido() {
    const detallePedido = document.getElementById("detallePedido");
    detallePedido.innerHTML = ""; // Limpiar el contenido actual


    // Mostrar cada producto en el resumen
    carrito.forEach(producto => {
        const productoElemento = document.createElement("p");
        productoElemento.textContent = `${producto.nombre} - $${producto.precio} x ${producto.cantidad} = $${producto.precio * producto.cantidad}`;
        detallePedido.appendChild(productoElemento);
    });


    // Calcular y mostrar el total
    const total = carrito.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0);
    document.getElementById("totalPedido").textContent = `Total: $${total}`;


    // Mostrar la sección de resumen
    document.getElementById("resumenPedido").style.display = "block";
}


// Función para confirmar la compra
function confirmarCompra() {
    alert("¡Gracias por tu compra! El pedido ha sido confirmado.");
    carrito = []; // Vaciar el carrito después de la compra
    mostrarCarrito(); // Actualizar la visualización del carrito
    guardarCarrito(); // Guardar el carrito vacío en localStorage


    // Ocultar el resumen del pedido después de confirmar
    document.getElementById("resumenPedido").style.display = "none";
}


// Botón para confirmar la compra
const botonConfirmarCompra = document.getElementById("confirmarCompra");
botonConfirmarCompra.addEventListener("click", confirmarCompra);


// Agregar un botón de "Ver Resumen" en el carrito
const botonVerResumen = document.createElement("button");
botonVerResumen.textContent = "Ver Resumen del Pedido";
botonVerResumen.addEventListener("click", mostrarResumenPedido);
document.getElementById("carrito").appendChild(botonVerResumen);


// Seleccionar el formulario de contacto
const formularioContacto = document.querySelector("form");


// Evento para mostrar una alerta cuando se envíe el formulario
formularioContacto.addEventListener("submit", (event) => {
    event.preventDefault(); // Evitar que se envíe el formulario y recargue la página


    alert("¡Gracias! Tu mensaje ha sido enviado correctamente.");
   
    formularioContacto.reset(); // Limpiar el formulario después de enviar
});




