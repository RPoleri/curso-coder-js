// Definimos los productos disponibles
const menu = [
    { id: "1", nombre: "Pizza", precio: 1200 },
    { id: "2", nombre: "Hamburguesa", precio: 1000 },
    { id: "3", nombre: "Ensalada", precio: 800 },
    { id: "4", nombre: "Sushi", precio: 1500 }
];

// Carrito vacío
let carrito = [];

// Función para seleccionar productos
function seleccionarProductos() {
    let seleccion;
    do {
        let opciones = "Menú disponible:\n";
        menu.forEach(item => {
            opciones += `${item.id}. ${item.nombre} - $${item.precio}\n`;
        });
        opciones += "V. Ver carrito\nR. Vaciar carrito\n0. Finalizar pedido";

        seleccion = prompt(opciones).toLowerCase();

        if (seleccion === "v") {
            verCarrito();
        } else if (seleccion === "r") {
            carrito = [];
            alert("El carrito ha sido vaciado.");
        } else {
            let producto = menu.find(item => item.id === seleccion);
            if (producto) {
                carrito.push(producto);
                alert(`Has agregado ${producto.nombre} al carrito.`);
            } else if (seleccion !== "0") {
                alert("Selección inválida, intenta nuevamente.");
            }
        }

    } while (seleccion !== "0");

    confirmarPedido();
}

// Función para mostrar el carrito antes de confirmar
function verCarrito() {
    if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    let resumen = "Tu carrito:\n";
    let total = 0;
    carrito.forEach(item => {
        resumen += `- ${item.nombre}: $${item.precio}\n`;
        total += item.precio;
    });
    resumen += `Total: $${total}`;

    alert(resumen);
}

// Función para confirmar el pedido
function confirmarPedido() {
    if (carrito.length === 0) {
        alert("¡Tenés que pedir algo antes de finalizar!");
        seleccionarProductos(); // Reiniciar el proceso si el carrito está vacío
        return;
    }

    verCarrito();
    if (confirm("¿Deseas confirmar el pedido?")) {
        alert("¡Pedido confirmado! Gracias por tu compra.");
    } else {
        alert("Pedido cancelado.");
    }
}

// Ejecutamos la función para iniciar el proceso de compra
seleccionarProductos();