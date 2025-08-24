import "../../../../Styles/Clientes/usuarioPrincipal.css";
import { post } from "../../../../Helpers/api";
import { confirmacion, success, error } from "../../../../Helpers/alertas";
import { contarCamposFormulario, limpiar, validarMinimo, VehiculosPorId } from "../../../../Helpers/Modules/modules";

import { get } from "../../../../Helpers/api";

export default async (parametros = null) => {
  let id = null;

  if (window.location.hash.includes("id=")) { // verifica si hay id en la url
    id = window.location.hash.split("id=")[1]; // toma el primer valor despues de "id="
  }

  if (id) { //guarda el id si existe
    localStorage.setItem("cliente_id", id);
  } else {
    id = localStorage.getItem("cliente_id"); // trae el id guardado en localStorage
  }

  if (!id) { //valida si existe un id 
    console.error("No se encontró un ID de usuario.");
    return;
  }
  const usuarios = await get(`Usuarios`);
  const vehiculos = await get(`Vehiculos/usuarios?id_usuario=${id}`);

  VehiculosPorId(vehiculos, usuarios);
  const dialogo = document.getElementById("insertarvehiculos");
  const btnRegistrar = document.getElementById("registrar_vehiculos");
  const cerrar = document.getElementById("cerrarvehiculos");
  const form = document.querySelector("#formVehiculo");

  btnRegistrar.addEventListener("click", () => {
    dialogo.showModal();
  });

  cerrar.addEventListener("click", () => {
    dialogo.close();
  });
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
  }
  form.addEventListener("submit", CrearVehiculos);

}