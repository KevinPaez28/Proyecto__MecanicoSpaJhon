import {get, post} from "../../../../Helpers/api" 
import { Categorias_Productos, limpiar, validarMinimo, contarCamposFormulario, validarLetras, validarNumeros} from "../../../../Helpers/Modules/modules"
import { confirmacion,success,error  } from "../../../../Helpers/alertas";
import "../../../../Styles/Administrador/CategoriasProductos.css";

export default async (parametros = null) =>{
  
  const categorias = await get('Categorias');
  const productos = await get('Productos');

  // DOM elementos de Categorías
  const select = document.querySelector("select");
  const contenedor = document.getElementById("contenedorCategorias");
  const Categoria = document.querySelector("#nombre");
  const formularioCategoria = document.querySelector("#categorias");
  const Nombre = document.querySelector("#Nombre");
  const Precio = document.querySelector("#Precio");
  const Unidad = document.querySelector("#stock");
  const formularioproductos = document.querySelector('#productos');
  const cerrarSesion = document.getElementById("cerrar_sesion");
  cerrarSesion.addEventListener("click", async (e) => {
    e.preventDefault(); // Evita que redireccione inmediatamente
    const confirmacionCerrar = await confirmacion("¿Desea cerrar sesión?");
    if (confirmacionCerrar.isConfirmed) {
      localStorage.clear();
      window.location.href = "#/Home"; 
    }
  });
  // Validar y crear Categorías
  const CrearCategorias = async (event) => {
    event.preventDefault();

    const totalRequeridos = contarCamposFormulario(formularioCategoria);
    let completados = 0;
    let datos = {};

    for (let i = 0; i < formularioCategoria.elements.length; i++) {
      const campo = formularioCategoria.elements[i];

      if (campo.hasAttribute('required')) {
        if (validarMinimo(campo)) {
          limpiar(campo);
          datos[campo.id.toLowerCase()] = campo.value.trim();
          completados++;
        }
      }
    }
      
    if (completados === totalRequeridos) {
    const confirm = await confirmacion("¿Desea Crear la Categoría?");
      if (confirm.isConfirmed) {
        const respuesta = await post('Categorias', datos);
        if (respuesta?.ok) {
          const ok = await success({ message: "Categoría registrada con éxito" });
          if (ok.isConfirmed) {
            formularioCategoria.reset();
            location.reload();
          }
        } else {
          await error("La categoría ya está creada.");
        }
      }

      } else {
        await error("Por favor completa todos los campos requeridos.");
      }
  };



  const CrearProductos = async (event) => {
    event.preventDefault();

    const totalRequeridos = contarCamposFormulario(formularioproductos);
let completados = 0;
let datos = {};

for (let i = 0; i < formularioproductos.elements.length; i++) {
  const campo = formularioproductos.elements[i];

  if (campo.hasAttribute('required')) {
    if (validarMinimo(campo)) {
      limpiar(campo);
      datos[campo.id.toLowerCase()] = campo.value.trim();
      completados++;
    }
  }
}

if (completados === totalRequeridos) {
  const confirm = await confirmacion("¿Desea Crear el Producto?");
  if (confirm.isConfirmed) {
    const respuesta = await post('Productos', datos);

    if (respuesta.ok) {
      // Todo bien, producto creado
      if ((await success({ message: "Producto registrado con éxito" })).isConfirmed) {
        formularioproductos.reset();
        location.reload();
      }
    } else {
      // Leer error desde la respuesta JSON
      let errorMsg = "No se pudo crear el producto";
      try {
        const errorData = await respuesta.json();
        if (errorData.error) {
          errorMsg = errorData.error;
        }
      } catch (e) {
        // no hacer nada, mantener mensaje por defecto
      }
      await error(errorMsg, "");
    }
  }
} else {
  await error("Por favor completa todos los campos requeridos.");
}
  };

  Nombre.addEventListener("blur", (event) => {
    if (validarMinimo(event.target)) limpiar(event.target);
  });

  Precio.addEventListener("keydown", validarNumeros);
  Precio.addEventListener("blur", (event) => {
    if (validarMinimo(event.target)) limpiar(event.target);
  });

  Unidad.addEventListener("keydown", validarNumeros);
  Unidad.addEventListener("blur", (event) => {
    if (validarMinimo(event.target)) limpiar(event.target);
  });


  Categoria.addEventListener("keydown", validarLetras);
  Categoria.addEventListener("blur", (event) => {
    if (validarMinimo(event.target)) limpiar(event.target);
  });


  formularioCategoria.addEventListener("submit", CrearCategorias);
  formularioproductos.addEventListener("submit", CrearProductos);

  Categorias_Productos(categorias, productos, select, contenedor);


}
