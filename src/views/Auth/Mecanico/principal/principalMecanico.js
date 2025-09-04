import "../../../../Styles/Mecanico/MecanicoPrincipal.css";
import { get, post } from "../../../../Helpers/api";
import { EditarReparaciones, ElimarReparaciones } from "../../../../Helpers/Modules/modules";

export default async () => {
  // Obtener el objeto usuario desde localStorage
  let usuario = localStorage.getItem("usuario");
  let usuario_id = null;

  if (usuario) {
    try {
      usuario = JSON.parse(usuario);
      usuario_id = usuario.usuario_id;
    } catch (e) {
      // Si no es un objeto, puede ser solo el id guardado como string
      usuario_id = usuario;
    }
  } else {
    // Si no existe, intenta obtener el id de mecanico_id
    usuario_id = localStorage.getItem("mecanico_id");
  }

  if (!usuario_id) {
    console.error("No se encontró un usuario_id en localStorage.");
    return;
  }

  const MostrarReparaciones = async () => {
    const detalleServicio = await get(`Reparaciones`);
    const contenedor = document.querySelector(".content__reparacion");
    contenedor.innerHTML = "";

    // Agrupar por detalle_id
    const agrupados = {};
    detalleServicio.data.forEach(item => {
      if (!agrupados[item.detalle_id]) {
        agrupados[item.detalle_id] = { ...item, productos: [] };
      }
      if (item.nombre_producto) {
        agrupados[item.detalle_id].productos.push({
          nombre: item.nombre_producto,
          cantidad: item.cantidad_usada
        });
      }
    });

    // Crear tabla tipo empleados
    const table = document.createElement("table");
    table.classList.add("tabla-empleados");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";

    // Encabezado
    const thead = document.createElement("thead");
    thead.innerHTML = `
      <tr>
        <th class="th-empleado">N°</th>
        <th class="th-empleado">Servicio</th>
        <th class="th-empleado">Vehículo</th>
        <th class="th-empleado">Estado</th>
        <th class="th-empleado">Fecha</th>
        <th class="th-empleado">Productos Utilizados</th>
        <th class="th-empleado">Observaciones</th>
        <th class="th-empleado">Acciones</th>
      </tr>
    `;
    table.appendChild(thead);

    // Cuerpo
    const tbody = document.createElement("tbody");

    Object.values(agrupados).forEach(element => {
      const tr = document.createElement("tr");

      // N°
      const tdNum = document.createElement("td");
      tdNum.classList.add("td-empleado");
      tdNum.textContent = element.detalle_id;
      tr.appendChild(tdNum);

      // Servicio
      const tdServicio = document.createElement("td");
      tdServicio.classList.add("td-empleado");
      tdServicio.textContent = element.nombre_servicio;
      tr.appendChild(tdServicio);

      // Vehículo
      const tdVehiculo = document.createElement("td");
      tdVehiculo.classList.add("td-empleado");
      tdVehiculo.textContent = element.placa;
      tr.appendChild(tdVehiculo);

      // Estado
      const tdEstado = document.createElement("td");
      tdEstado.classList.add("td-empleado", "estado", element.nombre_estado.toLowerCase());
      tdEstado.textContent = element.nombre_estado;
      tr.appendChild(tdEstado);

      // Fecha
      const tdFecha = document.createElement("td");
      tdFecha.classList.add("td-empleado");
      const fecha = new Date(element.fecha);
      tdFecha.textContent = fecha.toISOString().split("T")[0];
      tr.appendChild(tdFecha);

      // Productos
      const tdProductos = document.createElement("td");
      tdProductos.classList.add("td-empleado");
      tdProductos.innerHTML = element.productos.map(prod => `<div>${prod.nombre} - ${prod.cantidad} unidades</div>`).join("");
      tr.appendChild(tdProductos);

      // Observaciones
      const tdObservaciones = document.createElement("td");
      tdObservaciones.classList.add("td-empleado");
      tdObservaciones.textContent = element.observaciones || "";
      tr.appendChild(tdObservaciones);

      // Acciones
      const tdAcciones = document.createElement("td");
      tdAcciones.classList.add("td-empleado");
      tdAcciones.style.textAlign = "center";

      // Contenedor botones
      const divButtons = document.createElement("div");
      divButtons.classList.add("interfazvehiculos__button");

      // Botón Editar
      const btnEditar = document.createElement("button");
      btnEditar.type = "button";
      btnEditar.classList.add("interfazvehiculos__buttones");
      btnEditar.innerHTML = `<i class="bi bi-pencil"></i>`;
      divButtons.appendChild(btnEditar);

      // Botón Eliminar
      const btnEliminar = document.createElement("button");
      btnEliminar.type = "button";
      btnEliminar.classList.add("interfazvehiculos__buttones");
      btnEliminar.innerHTML = `<i class="bi bi-trash"></i>`;
      divButtons.appendChild(btnEliminar);

      tdAcciones.appendChild(divButtons);
      tr.appendChild(tdAcciones);

      // Eventos
      btnEditar.addEventListener("click", async () => {
        EditarReparaciones(tdServicio, tdVehiculo, tdEstado, tdFecha, tdProductos, tdObservaciones, btnEditar, element, detalleServicio);
      });

      btnEliminar.addEventListener("click", async () => {
        ElimarReparaciones(element.detalle_id, element.consumible_id, element.usuario_id);
      });

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    contenedor.appendChild(table);
  };

  MostrarReparaciones();
};
