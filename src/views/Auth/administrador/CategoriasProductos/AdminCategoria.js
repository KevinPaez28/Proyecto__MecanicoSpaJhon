import {get, post} from "../../../../Helpers/api" 
import { Categorias_Productos, limpiar, validarMinimo, contarCamposFormulario, validarLetras, validarNumeros} from "../../../../Helpers/Modules/modules"
import "../../../../Styles/CategoriasProductos.css";

export default async (parametros = null) =>{
  
  const categorias = await get('Categorias');
  const productos = await get('Productos');

  // DOM elementos de Categorías
  const select = document.querySelector("select");
  const contenedor = document.getElementById("contenedorCategorias");
  const Categoria = document.querySelector("#nombre");
  const formularioCategoria = document.querySelector("#categorias");

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
      const respuesta = await post('Categorias', datos);
      console.log(datos);
      
      if (respuesta?.ok) {
        alert("Categoría creada correctamente");
        formularioCategoria.reset();
        location.reload();
      } else {
        alert("No se pudo crear la categoría");
      }
    } else {
      alert("Por favor completa todos los campos requeridos.");
    }
  };

  const Nombre = document.querySelector("#Nombre");
  const Precio = document.querySelector("#Precio");
  const Unidad = document.querySelector("#stock");
  const formularioproductos = document.querySelector('#productos');

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
      const respuesta = await post('Productos', datos);
      if (respuesta?.ok) {
        alert("Producto creado correctamente");
        formularioproductos.reset();
        location.reload();
      } else {
        alert("No se pudo crear el producto");
      }
    } else {
      alert("Por favor completa todos los campos requeridos.");
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
