import { get } from "../../../../Helpers/api";
import { ObtenerUsuariosNombreCedulaROl,TotalDeClientes } from "../../../../Helpers/Modules/modules";
import "../../../../Styles/AdminPrincipal.css";


export default async (parametros = null) =>{
  const Roles = await get('Roles'); 
  const Usuarios = await get('Usuarios')
  const TotalUsuariosRegistrados = await get('Usuarios/buscar'); 
  ObtenerUsuariosNombreCedulaROl(Roles, TotalUsuariosRegistrados);
  TotalDeClientes(Usuarios)

  // function ObtenerUsuariosNombreCedulaROl(Roles, usuarios) {
  //   try {
  //     if (!usuarios || !Array.isArray(usuarios)) {
  //       throw new Error("No se pudo obtener la lista de usuarios.");
  //     }

  //     const empleados = document.querySelector(".menu__empleados");
  //     empleados.innerHTML = ""; 
  //     usuarios.forEach(element => {
  //       const empleados_content = document.createElement("div");
  //       empleados_content.classList.add("Menu__empleados-content");

  //       const pNombre = document.createElement("p");
  //       pNombre.classList.add("Menu__empleados-pnombres");
  //       pNombre.textContent = element.nombre;

  //       const pCedula = document.createElement("p");
  //       pCedula.classList.add("Menu__empleados-pcedula");
  //       pCedula.textContent = element.cedula;

  //       const pRol = document.createElement("p");
  //       pRol.classList.add("Menu__empleados-prol");

  //       const rolEncontrado = Roles.find(r => r.rol_id == element.rol_id);
  //       pRol.textContent = rolEncontrado ? rolEncontrado.nombre : "Desconocido";

  //       empleados_content.appendChild(pNombre);
  //       empleados_content.appendChild(pCedula);
  //       empleados_content.appendChild(pRol);

  //       empleados.appendChild(empleados_content);
  //     });

  //   } catch (error) {
  //     console.error('Error al obtener usuarios:', error);
  //   }
  // }
  // function TotalDeClientes(usuarios) {
  //   const elementosMenuNumbers = document.querySelectorAll('.menu__numbers');
  //   if (!elementosMenuNumbers || elementosMenuNumbers.length === 0) return;
  //   const clientesFiltrados = usuarios.filter(usuario => usuario.rol_id === 2);
  //   elementosMenuNumbers[0].textContent = clientesFiltrados.length;
  // }
}