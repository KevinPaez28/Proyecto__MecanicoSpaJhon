import { get , post } from "../../../../Helpers/api";
import { contarCamposFormulario,validar,validarCorreo,validarMinimo,validarCedula,validarContrasenia,validarLetras,validarNumeros,validarMaximo,limpiar,ModificarUsuarios } from "../../../../Helpers/Modules/modules"
import "../../../../Styles/registerEmpleado.css";

export default async () => {
  const select = document.querySelector("select")
  const usuarios = await get('Usuarios'); 
  const roles = await get('Roles'); 

  roles.forEach(element => {
      const option = document.createElement('option');
      option.setAttribute('value', element.rol_id); 
      option.textContent = element.nombre;          
      select.append(option);
  });

  const cedula= document.querySelector("#cedula")
  const nombre= document.querySelector("#nombre")
  const correo= document.querySelector("#correo")
  const telefono= document.querySelector("#telefono")
  const usuario= document.querySelector("#usuario")
  const contraseña= document.querySelector("#contrasena")
  const rol_id= document.querySelector("#rol")



  const formulario = document.querySelector("#formUsuario");
  const cantidadCampos = contarCamposFormulario(formulario);

  const nuevoUsuario = async (event) => {
    event.preventDefault();

    const datos = validar(event);

    if (Object.keys(datos).length === cantidadCampos) {
      datos['rol_id'] = Number(datos['rol']);
      delete datos['rol'];

      datos['cedula'] = datos['cedula'].trim();
      datos['telefono'] = datos['telefono'].trim();
      datos['nombre'] = datos['nombre'].trim();
      datos['correo'] = datos['correo'].trim();
      datos['usuario'] = datos['usuario'].trim();
      datos['contrasena'] = datos['contrasena'].trim();

      delete datos['documento']; 

      const respuesta = await post('Usuarios', datos);

      if (respuesta?.ok) {
        alert("Usuario creado correctamente");
        formulario.reset();
        location.reload();
      } else {
        alert("No se pudo crear el usuario");
      }
    } else {
      alert("Faltan campos válidos");
    }
  };
  if (formulario.dataset.listener === "true") {
    return;
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

  const dialogo = document.getElementById("EliminarUsuario"); 
  const btnEliminarUsuarios = document.getElementById("Eliminar");
  const cerrar = document.getElementById("cerrarDialogo");

  btnEliminarUsuarios.addEventListener("click", () => {
    ModificarUsuarios(usuarios, roles); 
    dialogo.showModal();
  });

  cerrar.addEventListener("click", () => {
    dialogo.close(); 
  });
      formulario.dataset.listener = "true";

}