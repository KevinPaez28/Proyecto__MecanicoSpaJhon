import { get, put, del } from "../../../../../Helpers/api.js";
import { success, error, eliminar } from "../../../../../Helpers/alertas.js";
import "../../../../../Styles/Administrador/CategoriasProductos.css";

export default async (parametros = null) => {
    const contenedor = document.querySelector(".contenido");
    if (!contenedor) return;
    contenedor.innerHTML = "";

    // Obtener productos y categorías
    const productos = await get("Productos");
    const categorias = await get("Categorias");

    // Crear formulario para cada producto
    productos.data.forEach(producto => {
        const form = document.createElement("form");
        form.classList.add("form-editar-producto");

        // Nombre
        const inputNombre = document.createElement("input");
        inputNombre.type = "text";
        inputNombre.value = producto.nombre;
        inputNombre.className = "editar-input";
        inputNombre.placeholder = "Nombre";

        // Stock
        const inputStock = document.createElement("input");
        inputStock.type = "number";
        inputStock.value = producto.stock;
        inputStock.className = "editar-input";
        inputStock.placeholder = "Stock";
        inputStock.min = 0;

        // Precio
        const inputPrecio = document.createElement("input");
        inputPrecio.type = "number";
        inputPrecio.value = producto.precio;
        inputPrecio.className = "editar-input";
        inputPrecio.placeholder = "Precio";
        inputPrecio.min = 0;
        inputPrecio.step = "0.01";

        // Categoría
        const selectCategoria = document.createElement("select");
        selectCategoria.className = "editar-input";
        categorias.data.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat.categoria_id;
            option.textContent = cat.nombre;
            if (cat.categoria_id == producto.categoria_id) option.selected = true;
            selectCategoria.appendChild(option);
        });

        // Botón guardar
        const btnGuardar = document.createElement("button");
        btnGuardar.type = "submit";
        btnGuardar.textContent = "Guardar";
        btnGuardar.className = "btn-modificar";

        // Botón eliminar
        const btnEliminar = document.createElement("button");
        btnEliminar.type = "button";
        btnEliminar.textContent = "Eliminar";
        btnEliminar.className = "btn-eliminar";
        btnEliminar.style.marginLeft = "8px";

        form.append(inputNombre, inputStock, inputPrecio, selectCategoria, btnGuardar, btnEliminar);
        contenedor.appendChild(form);

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const datos = {
                nombre: inputNombre.value,
                stock: parseInt(inputStock.value),
                precio: parseFloat(inputPrecio.value),
                categoria_id: selectCategoria.value
            };
            const respuesta = await put(`Productos/${producto.producto_id}`, datos);
            if (respuesta.ok) {
                await success({ message: "Producto actualizado con éxito" });
                window.location.href = "#/administrador/Categorias";
            } else {
                let mensajes = respuesta.errors ? respuesta.errors.map(e => `${e.campo}: ${e.message}`).join("\n") : (respuesta.message || "No se pudo actualizar");
                await error("Error al actualizar producto", mensajes);
            }
        });
        
        btnEliminar.addEventListener("click", async () => {
            const confirmacion = await eliminar("¿Deseas eliminar este producto?");
            if (confirmacion.isConfirmed) {
                const respuesta = await del(`Productos/${producto.producto_id}`);
                if (respuesta.ok) {
                    await success({ message: "Producto eliminado con éxito" });
                    window.location.href = "#/administrador/Categorias";
                } else {
                    let mensajes = respuesta.errors ? respuesta.errors.map(e => `${e.campo}: ${e.message}`).join("\n") : (respuesta.message || "No se pudo eliminar");
                    await error("Error al eliminar producto", mensajes);
                }
            }
        });
    });
}