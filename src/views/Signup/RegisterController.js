import { post } from "../../Helpers/api.js";
import { contarCamposFormulario, validar, validarCorreo, validarMinimo, validarCedula, validarContrasenia, validarLetras, validarNumeros, validarMaximo, limpiar, validarFormularioCompleto } from "../../Helpers/Modules/modules.js"
import { error, success, confirmacion } from "../../Helpers/alertas.js";
import "../../Styles/Signup.css";
import "../../Components/formularioUsuarios.css";
import "../../Components/botonesadmin.css";
export default (parametros = null) => {
  // const toggle = document.querySelector(".menu-toggle");
  // const navLinks = document.querySelector(".nav-links");
  // toggle.addEventListener("click", () => {
  //   navLinks.classList.toggle("active");
  // });
  const cedula = document.querySelector("#cedula")
  const nombre = document.querySelector("#nombre")
  const correo = document.querySelector("#correo")
  const telefono = document.querySelector("#telefono")
  const usuario = document.querySelector("#usuario")
  const contraseña = document.querySelector("#contrasena")
  const rol_id = document.querySelector("#rol")



  const formulario = document.querySelector("#formUsuario");
  const cantidadCampos = contarCamposFormulario(formulario);

  const nuevoUsuario = async (event) => {
    event.preventDefault();

    const datos = validar(event);
    validarFormularioCompleto(formulario)
    if (Object.keys(datos).length === cantidadCampos) {
      datos['rol_id'] = 2;

      datos['cedula'] = datos['cedula'].trim();
      datos['telefono'] = datos['telefono'].trim();
      datos['nombre'] = datos['nombre'].trim();
      datos['correo'] = datos['correo'].trim();
      datos['usuario'] = datos['usuario'].trim();
      datos['contrasena'] = datos['contrasena'].trim();
      datos['id_estado'] = 1

      delete datos['documento'];
      const respuesta = await post('Usuarios', datos);
      console.log(respuesta);

      if (!respuesta.data) {
        await error("Respuesta inválida del servidor", "");
        return null;
      }

      if (respuesta.ok) {
        const confirmado = await success({ message: "Usuario registrado con éxito" });
        if (confirmado.isConfirmed) formulario.reset();
        return respuesta.data;
      }

      if (respuesta.data.erros && respuesta.data.erros.length > 0) {
        let mensajes = "";
        for (let i = 0; i < respuesta.data.erros.length; i++) {
          mensajes += respuesta.data.erros[i].message + "\n";
        }
        await error(mensajes);
      } else {
        await error(respuesta.data.message || "No se pudo crear el usuario", "");
      }

    }
  }

  formulario.addEventListener('submit', nuevoUsuario);

  nombre.addEventListener('keydown', validarLetras);
  nombre.addEventListener('keydown', (event) => {
    if (validarMinimo(event.target)) limpiar(event.target);
  });
  nombre.addEventListener('blur', (event) => {
    if (validarMinimo(event.target)) limpiar(event.target);
  });

  telefono.addEventListener('keydown', validarNumeros);
  telefono.addEventListener('keydown', validarMaximo);
  telefono.addEventListener('keydown', (event) => {
    if (validarMinimo(event.target)) limpiar(event.target);
  });
  telefono.addEventListener('blur', (event) => {
    if (validarMinimo(event.target)) limpiar(event.target);
  });

  cedula.addEventListener('keydown', validarNumeros);
  cedula.addEventListener('keydown', validarMaximo);
  cedula.addEventListener('keydown', (event) => {
    if (validarCedula(event.target)) limpiar(event.target);
  });
  cedula.addEventListener('blur', (event) => {
    if (validarMinimo(event.target)) limpiar(event.target);
  });

  correo.addEventListener('keydown', (event) => {
    if (validarCorreo(event.target)) limpiar(event.target);
  });
  correo.addEventListener('blur', (event) => {
    if (validarCorreo(event.target)) limpiar(event.target);
  });

  contraseña.addEventListener('keydown', (event) => {
    if (validarContrasenia(event.target)) limpiar(event.target);
  });
  contraseña.addEventListener('blur', (event) => {
    if (validarContrasenia(event.target)) limpiar(event.target);
  });

}

