import { get, post } from "../../../../Helpers/api";
import { contarCamposFormulario, limpiar, validarFormularioCompleto, validarLetras, validarMinimo, Vehiculos } from "../../../../Helpers/Modules/modules";
import "../../../../Styles/Administrador/VehiculosAdmin.css";
import { confirmacion, success, error } from "../../../../Helpers/alertas";


export default async (parametros = null) => {

  // Cargar datos iniciales
  const vehiculos = await get('Vehiculos');
  const usuarios = await get('Usuarios');


  // Elementos del DOM
  const dialogo = document.getElementById("insertarvehiculos");
  const cerrar = document.getElementById("cerrarvehiculos");
  const btnRegistrar = document.getElementById("registrar_vehiculos");
  const form = document.querySelector("#formVehiculo");
  const modelo = document.querySelector("#modelo");
  const marca = document.querySelector("#marca")
  const Usuario = document.querySelector("#usuario")
  const cerrarSesion = document.getElementById("cerrar_sesion");
  cerrarSesion.addEventListener("click", async (e) => {
    e.preventDefault(); // Evita que redireccione inmediatamente
    const confirmacionCerrar = await confirmacion("¿Desea cerrar sesión?");
    if (confirmacionCerrar.isConfirmed) {
      localStorage.clear();
      window.location.href = "#/Home"; 
    }
  });
  console.log(vehiculos)
  console.log(usuarios)

  Vehiculos(vehiculos, usuarios);
  // Abrir y cerrar el diálogo
  btnRegistrar.addEventListener("click", () => {
    dialogo.showModal();
  });

  cerrar.addEventListener("click", () => {
    dialogo.close();
  });

  // Manejo del formulario
  const CrearVehiculos = async (event) => {
    event.preventDefault();
     // Limpiar errores visuales anteriores
  for (let i = 0; i < form.elements.length; i++) {
    limpiar(form.elements[i]);
  }

  const contarcampos = contarCamposFormulario(form);
  let completados = 0;
  let datos = {};

  for (let i = 0; i < form.elements.length; i++) {
    const campo = form.elements[i];
    if (campo.hasAttribute('required')) {
      if (validarMinimo(campo)) {
        limpiar(campo);
        datos[campo.id.toLowerCase()] = campo.value.trim();
        completados++;
      }
    }
  }

  if (completados !== contarcampos) {
    dialogo.close();
    await error("Por favor completa todos los campos requeridos.");
    location.reload();
    return;
  }

  console.log(datos);
  dialogo.close();

  const confirm = await confirmacion("¿Desea Crear el Vehículo?");
  if (!confirm.isConfirmed) return;

  const respuesta = await post('Vehiculos', datos);

  if (respuesta.ok) {
    if ((await success({ message: "Vehículo registrado con éxito" })).isConfirmed) {
      location.reload();
    }
  } else {
    // Captura directa del mensaje del backend
    const mensajeError = respuesta.data?.error || "No se pudo crear el vehículo";
    await error(mensajeError, "");
  }
  };

  modelo.addEventListener('blur', (event) => {
    if (validarMinimo(event.target)) limpiar(event.target);
  });
  Usuario.addEventListener('blur', (event) => {
    if (validarMinimo(event.target)) limpiar(event.target);
  });
  marca.addEventListener('keydown', validarLetras);
  marca.addEventListener('blur', (event) => {
    if (validarMinimo(event.target)) limpiar(event.target);
  })
  form.addEventListener("submit", CrearVehiculos);
}