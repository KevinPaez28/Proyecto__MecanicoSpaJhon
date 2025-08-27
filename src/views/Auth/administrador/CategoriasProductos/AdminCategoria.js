import { get, post, del } from "../../../../Helpers/api"
import { Categorias_Productos, limpiar, validarMinimo, contarCamposFormulario, validarLetras, validarNumeros } from "../../../../Helpers/Modules/modules"
import { confirmacion, success, error, eliminar } from "../../../../Helpers/alertas";
import "../../../../Styles/Administrador/CategoriasProductos.css";
import '../../../../Components/botonesadmin.css'

export default async (parametros = null) => {

  const categorias = await get('Categorias');
  const productos = await get('Productos');

  // DOM elementos de Categorías
  const select = document.querySelector("select");
  const contenedor = document.getElementById("contenedorCategorias");
  const cerrarSesion = document.getElementById("cerrar_sesion");
  cerrarSesion.addEventListener("click", async (e) => {
    e.preventDefault(); // Evita que redireccione inmediatamente
    const confirmacionCerrar = await confirmacion("¿Desea cerrar sesión?");
    if (confirmacionCerrar.isConfirmed) {
      localStorage.clear();
      window.location.href = "#/Home";
    }
  });
  const Categorias_Productos = (Categorias, Productos, contenedorPadre) => {
    Categorias.data.forEach(element => {
      const card = document.createElement("div");
      card.classList.add("interfazcategorias__Cards");

      const body = document.createElement("div");
      body.classList.add("interfazcategorias__body");

      const nombre = document.createElement("div");
      nombre.classList.add("interfazcategorias__nombre");
      nombre.textContent = element.nombre;

      const divItem = document.createElement("div");
      divItem.classList.add("interfazcategorias__nombre-item");

      const innerDiv = document.createElement("div");
      innerDiv.classList.add("interfazcategorias__nombre_content");

      const pStock = document.createElement("p");
      pStock.textContent = "Stock";

      const pNombre = document.createElement("p");
      pNombre.textContent = "Nombre";

      const pPrecio = document.createElement("p");
      pPrecio.textContent = "Precio";

      innerDiv.append(pStock, pNombre, pPrecio);
      divItem.appendChild(innerDiv);

      const productos = document.createElement("div");
      productos.classList.add("interfazcategorias__productos");

      productos.appendChild(divItem);

      const btnEditar = document.createElement("button");
      btnEditar.classList.add("interfazcategorias__buttones");
      btnEditar.textContent = "Editar";

      const btnEliminar = document.createElement("button");
      btnEliminar.classList.add("interfazcategorias__buttones");
      btnEliminar.textContent = "Eliminar";

      let Productos_Categoriaid = element.categoria_id;
      const productosFiltrados = Productos.data.filter(p => p.categoria_id == element.categoria_id);

      if (productosFiltrados.length > 0) {
        productosFiltrados.forEach(p => {
          const divProducto = document.createElement("div");
          divProducto.classList.add("interfazcategorias__productos_item");

          const stock = document.createElement("p");
          stock.textContent = p.stock;

          const nombreProducto = document.createElement("p");
          nombreProducto.textContent = p.nombre;

          const precio = document.createElement("p");
          precio.textContent = parseFloat(p.precio).toString();

          divProducto.append(stock, nombreProducto, precio);

          productos.appendChild(divProducto);

          btnEditar.addEventListener("click", (e) => {
            e.preventDefault();
            window.location.href = `#/administrador/Productos/Editar`;
          });
        });
      } else {
        const sinProductos = document.createElement("em");
        sinProductos.textContent = "No hay productos";
        productos.appendChild(sinProductos);
      }

      const botones = document.createElement("div");
      botones.classList.add("interfazcategorias__button");

      btnEliminar.addEventListener("click", async () => {
        if (productosFiltrados.length === 0) {
          try {
            const confirmacion = await eliminar("La categoría está vacía. ¿Desea eliminarla?");
            if (confirmacion.isConfirmed) {
              const respuesta = await del(`Categorias/${Productos_Categoriaid}`);
              if (respuesta.ok) {
                await success({ message: "Categoría eliminada con éxito" });
                card.remove();
              } else {
                await error("No se pudo eliminar la categoría");
              }
            }
          } catch (err) {
            console.error("Error al eliminar la categoría:", err);
            await error("Error inesperado al eliminar");
          }
        } else {
          await error("La categoría tiene productos, elimínelos primero");
        }
      });

      botones.append(btnEditar, btnEliminar);

      body.append(nombre, productos, botones);
      card.appendChild(body);
      contenedorPadre.appendChild(card);

    });
  };

  Categorias_Productos(categorias, productos, contenedor);


}
