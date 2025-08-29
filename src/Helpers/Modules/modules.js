import { get, del, put, patch, post } from "../api.js";
import { confirm, success, error, eliminar } from "../alertas.js";
export const ObtenerUsuariosNombreCedulaROl = (Roles, usuarios) => {
  try {
    if (!usuarios) {
      throw new Error("No se pudo obtener la lista de usuarios.");
    }

    const empleados = document.querySelector(".menu__empleados-contenido");
    empleados.innerHTML = ""
    usuarios.data.forEach(element => {
      const empleados_content = document.createElement("div");
      empleados_content.classList.add("Menu__empleados-content");

      const pNombre = document.createElement("p");
      pNombre.classList.add("Menu__empleados-pnombres");
      pNombre.textContent = element.nombre;

      const pCedula = document.createElement("p");
      pCedula.classList.add("Menu__empleados-pcedula");
      pCedula.textContent = element.cedula;

      const pRol = document.createElement("p");
      pRol.classList.add("Menu__empleados-prol");

      const rolEncontrado = Roles.data.find(r => r.rol_id == element.rol_id);
      pRol.textContent = rolEncontrado ? rolEncontrado.nombre_rol : "Desconocido";

      empleados_content.appendChild(pNombre);
      empleados_content.appendChild(pCedula);
      empleados_content.appendChild(pRol);

      empleados.appendChild(empleados_content);
    });

  } catch (error) {
    console.error('Error al obtener usuarios:', error);
  }
}
export const ObteneReparacionesadmin = async () => {
  const reparaciones = await get(`Reparaciones/admin`)
  const contenedor = document.querySelector(".menu__trabajos");
  contenedor.innerHTML = "";

  reparaciones.data.forEach(element => {
    const reparacion_content = document.createElement("div");
    reparacion_content.classList.add("Menu__reparaciones-content");

    const pPlaca = document.createElement("p");
    pPlaca.classList.add("Menu__reparaciones-datos");
    pPlaca.textContent = element.placa;

    const pUsuario = document.createElement("p");
    pUsuario.classList.add("Menu__reparaciones-datos");
    pUsuario.textContent = element.usuario;

    const pEstado = document.createElement("p");
    pEstado.classList.add("Menu__reparaciones-datos");
    pEstado.textContent = element.estado;

    const pServicio = document.createElement("p");
    pServicio.classList.add("Menu__reparaciones-datos");
    pServicio.textContent = element.detalle_id;

    reparacion_content.appendChild(pServicio);
    reparacion_content.appendChild(pPlaca);
    reparacion_content.appendChild(pUsuario);
    reparacion_content.appendChild(pEstado);

    contenedor.appendChild(reparacion_content);
  });
}
export const fechaPlacaServicio = async () => {
  const reparaciones = await get(`Reparaciones/fecha`);
  const contenedor = document.querySelector(".menu__fechas");
  contenedor.innerHTML = "";

  reparaciones.data.forEach(element => {
    const reparacion_content = document.createElement("div");
    reparacion_content.classList.add("Menu__fechas-content");

    // Ejemplo: mostrar placa y servicio en un solo párrafo
    const pInfo = document.createElement("p");
    pInfo.classList.add("menu__fechasDatos");
    pInfo.textContent = `Fecha: ${element.fecha} | Placa: ${element.placa || 'N/A'} | Servicio: ${element.nombre_servicio || 'N/D'}`;

    // Ejemplo: mostrar cliente o estado en otro párrafo


    reparacion_content.appendChild(pInfo);

    contenedor.appendChild(reparacion_content);
  });
}
export const TotalDeClientes = async (usuarios) => {
  const reparaciones = await get(`Reparaciones`)
  const totalFacturas = await get(`facturas/totalventas`)
  console.log(totalFacturas.data);
  console.log(totalFacturas.data.total);
  const elementosMenuNumbers = document.querySelectorAll('.menu__numbers');
  if (!elementosMenuNumbers || elementosMenuNumbers.length === 0) return;

  // Contar clientes
  const clientesFiltrados = usuarios.data.filter(usuario => usuario.rol_id == 2);
  elementosMenuNumbers[0].textContent = clientesFiltrados.length;

  // Contar consultas en proceso
  const consultasEnProceso = reparaciones.data.filter(consulta => consulta.nombre_estado === 'Procesando');
  elementosMenuNumbers[1].textContent = consultasEnProceso.length;
  let Total = 0;

  totalFacturas.data.forEach(factura => {
    console.log(`Factura ${factura.factura_id} → Total: ${factura.total}`);
    Total += parseFloat(factura.total);
  });

  const totalNormal = Total;
  elementosMenuNumbers[2].textContent = totalNormal.toLocaleString("es-CO");
};
export const ProdcutosAgotados = async () => {
  const productos = await get("Productos");
  const contenedor = document.querySelector(".productos_cantidad");
  // Filtrar productos con stock menor a 2
  const pocosProductos = productos.data.filter(p => p.stock < 2);

  pocosProductos.forEach(element => {
    const productoCard = document.createElement("div");
    productoCard.classList.add("menu__productos-content");

    // Nombre del producto
    const pNombre = document.createElement("p");
    pNombre.classList.add("menu__productoNombre");
    pNombre.textContent = `Producto: ${element.nombre}`;

    // Stock
    const pStock = document.createElement("p");
    pStock.classList.add("menu__productoStock");
    pStock.textContent = `Stock: ${element.stock}`;

    // Añadir todo al card
    productoCard.appendChild(pNombre);
    productoCard.appendChild(pStock);

    contenedor.appendChild(productoCard);
  });
}

// Función que valida si el usuario tiene el permiso
export const tienePermiso = (permiso) => {

  const permisosGuardados = localStorage.getItem('permisos');

  if (!permisosGuardados) return false;

  try {
    const permisosArray = JSON.parse(permisosGuardados);
    // Solo extraemos los nombres de permisos
    const permisos = permisosArray.map(p => p.permiso);
    console.log(permisos.includes(permiso));

    return permisos.includes(permiso);
  } catch (e) {
    console.error("Error al parsear permisos:", e);
    return false;
  }
};


export const convertirPermisosArray = (permisos) => {
  // Convierte la cadena de permisos en un array de caracteres
  permisos = permisos.split("");
  // Variable auxiliar para construir la cadena limpia
  let aux = "";
  // Recorre cada carácter de la cadena de permisos
  for (let n = 0; n < permisos.length; n++) {
    // Si es el primer carácter, el último o un espacio, lo omite
    if (n == 0 || n == permisos.length - 1 || permisos[n] == " ") continue
    // Agrega el carácter a la variable auxiliar
    aux += permisos[n];
  }
  // Divide la cadena auxiliar por comas para obtener el array de permisos
  permisos = aux.split(",");
  // Retorna el array de permisos
  return permisos;
}


//CLIENTES


export const Clientesbyid = async () => {
  const content = document.querySelector(".infodatos")
  const title = document.querySelector(".titleNombre")
  const buttons = document.querySelector(".contentbuttons")
  const mecanicoId = localStorage.getItem("mecanico_id");


  const clienteGuardado = JSON.parse(localStorage.getItem("usuario"));
  let id = null;
  // Validar que exista
  if (clienteGuardado) {
    id = clienteGuardado.usuario_id;
    console.log("El ID es:", id);
  } else {
    console.log("No hay cliente en el localStorage");
  }
  // Si existe usuario_id
  const Usuarios = await get(`Usuarios/${id}`);
  console.log(Usuarios);
  

  const infonombre = document.createElement("p")
  infonombre.classList.add("infotitlename")
  infonombre.textContent = Usuarios.data.nombre

  const infocedula = document.createElement("p")
  infocedula.classList.add("infotext")
  infocedula.textContent = Usuarios.data.cedula;

  const infocorreo = document.createElement("p")
  infocorreo.classList.add("infotext")
  infocorreo.textContent = Usuarios.data.correo

  const infotelefono = document.createElement("p")
  infotelefono.classList.add("infotext")
  infotelefono.textContent = Usuarios.data.telefono

  const infousuario = document.createElement("p")
  infousuario.classList.add("infotext")
  infousuario.textContent = Usuarios.data.usuario




  const btnEditar = document.createElement("button");
  btnEditar.textContent = "Editar";
  btnEditar.classList.add("btnUsuarios");

  const btnEliminar = document.createElement("button");
  btnEliminar.textContent = "Eliminar";
  btnEliminar.classList.add("btnUsuarios");

  btnEditar.addEventListener("click", async (e) => {
    e.preventDefault();
    EditarClientes(infocedula, infocorreo, infotelefono, infousuario, btnEditar, id, Usuarios.nombre)
  })

  title.appendChild(infonombre)
  content.appendChild(infocedula)
  content.appendChild(infocorreo)
  content.appendChild(infotelefono)
  content.appendChild(infousuario)


  buttons.appendChild(btnEditar)
  buttons.appendChild(btnEliminar)
}
export const EditarClientes = (infocedula, infocorreo, infotelefono, infousuario, btnEditar, id, name) => {

  const inputCedula = document.createElement("input");
  inputCedula.classList.add("clienteModificacion__input");
  inputCedula.value = infocedula.textContent;
  infocedula.replaceWith(inputCedula);

  const inputCorreo = document.createElement("input");
  inputCorreo.classList.add("clienteModificacion__input");
  inputCorreo.value = infocorreo.textContent;
  infocorreo.replaceWith(inputCorreo);

  const inputTelefono = document.createElement("input");
  inputTelefono.classList.add("clienteModificacion__input");
  inputTelefono.value = infotelefono.textContent;
  infotelefono.replaceWith(inputTelefono);

  const inputUsuario = document.createElement("input");
  inputUsuario.classList.add("clienteModificacion__input");
  inputUsuario.value = infousuario.textContent;
  infousuario.replaceWith(inputUsuario);

  // Cambiar el botón a "Guardar"
  btnEditar.textContent = "Guardar";
  btnEditar.classList.remove("btnUsuarios");
  btnEditar.classList.add("btn-guardarClientes");

  // Nueva acción al hacer clic en "Guardar"
  btnEditar.addEventListener("click", async () => {
    const nuevoUsuario = {
      nombre: name,
      cedula: inputCedula.value.trim(),
      correo: inputCorreo.value.trim(),
      telefono: inputTelefono.value.trim(),
      usuario: inputUsuario.value.trim(),
      estado_usuario_id: 1,
      rol_id: 2
    };
    try {
      const respuesta = await put(`Usuarios/${id}`, nuevoUsuario);

      const confirmacion = await confirm("¿Desea actualizar el usuario?");
      if (confirmacion.isConfirmed) {
        if (respuesta.ok) {
          if ((await success({ message: "Usuario actualizado con éxito" })).isConfirmed) {
            location.reload();
          }
        } else {
          await error(respuesta.data?.error || "No se pudo actualizar el usuario");
          location.reload()
        }
      }
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      await error("Error inesperado al actualizar");
    }
  });
}
export const MostrarReparacionescliente = (reparaciones, facturas) => {
  const seccionInfo = document.querySelector(".ReparacionesUsuarios");
  const seccionfactura = document.querySelector(".facturas")
  seccionInfo.innerHTML = "";
  console.log(reparaciones);

  reparaciones.data.forEach((element) => {
    const card = document.createElement("div");
    card.classList.add("reparacionesUsuarios");

    const body = document.createElement("div");
    body.classList.add("interfazreparaciones__body");

    const infoWrapper = document.createElement("div");
    infoWrapper.classList.add("interfazreparaciones__info");

    // Títulos
    const titulos = document.createElement("div");
    titulos.classList.add("interfazreparaciones__contentCards");

    const pPlaca = document.createElement("p");
    pPlaca.classList.add("interfazreparaciones__titulonombre");
    pPlaca.textContent = "Placa:";
    titulos.appendChild(pPlaca);

    const pUsuario = document.createElement("p");
    pUsuario.classList.add("interfazreparaciones__titulonombre");
    pUsuario.textContent = "Usuario:";
    titulos.appendChild(pUsuario);

    const pEstado = document.createElement("p");
    pEstado.classList.add("interfazreparaciones__titulonombre");
    pEstado.textContent = "Estado:";
    titulos.appendChild(pEstado);

    const pServicio = document.createElement("p");
    pServicio.classList.add("interfazreparaciones__titulonombre");
    pServicio.textContent = "Servicio:";
    titulos.appendChild(pServicio);

    // Contenido
    const content = document.createElement("div");
    content.classList.add("interfazreparaciones__contentCard");

    const placa = document.createElement("p");
    placa.classList.add("interfazreparaciones__datos");
    placa.textContent = element.placa || "Sin placa";

    const usuario = document.createElement("p");
    usuario.classList.add("interfazreparaciones__datos");
    usuario.textContent = element.cliente || "Sin usuario";

    const estado = document.createElement("p");
    estado.classList.add("interfazreparaciones__datos");
    estado.textContent = element.estado || "Sin estado";

    const servicio = document.createElement("p");
    servicio.classList.add("interfazreparaciones__datos");
    servicio.textContent = element.servicio || "Sin servicio";

    content.appendChild(placa);
    content.appendChild(usuario);
    content.appendChild(estado);
    content.appendChild(servicio);

    // Estructura final
    infoWrapper.appendChild(titulos);
    infoWrapper.appendChild(content);
    body.appendChild(infoWrapper);
    card.appendChild(body);
    seccionInfo.appendChild(card);

  });
  facturas.data.forEach((element) => {
    const card = document.createElement("div");
    card.classList.add("facturasUsuarios");

    const infoWrapper = document.createElement("div");
    infoWrapper.classList.add("interfazfacturas__info");

    // ---- Títulos ----
    const titulos = document.createElement("div");
    titulos.classList.add("interfazfacturas__contentCards");

    const pFactura = document.createElement("p");
    pFactura.classList.add("interfazfacturas__titulonombre");
    pFactura.textContent = "Factura N°:";
    titulos.appendChild(pFactura);

    const pCliente = document.createElement("p");
    pCliente.classList.add("interfazfacturas__titulonombre");
    pCliente.textContent = "Cliente:";
    titulos.appendChild(pCliente);

    const pEmpresa = document.createElement("p");
    pEmpresa.classList.add("interfazfacturas__titulonombre");
    pEmpresa.textContent = "Empresa:";
    titulos.appendChild(pEmpresa);

    const pNIT = document.createElement("p");
    pNIT.classList.add("interfazfacturas__titulonombre");
    pNIT.textContent = "NIT:";
    titulos.appendChild(pNIT);

    const pDireccion = document.createElement("p");
    pDireccion.classList.add("interfazfacturas__titulonombre");
    pDireccion.textContent = "Dirección:";
    titulos.appendChild(pDireccion);

    const pCorreo = document.createElement("p");
    pCorreo.classList.add("interfazfacturas__titulonombre");
    pCorreo.textContent = "Correo:";
    titulos.appendChild(pCorreo);

    const pRepresentante = document.createElement("p");
    pRepresentante.classList.add("interfazfacturas__titulonombre");
    pRepresentante.textContent = "Representante:";
    titulos.appendChild(pRepresentante);

    const pFecha = document.createElement("p");
    pFecha.classList.add("interfazfacturas__titulonombre");
    pFecha.textContent = "Fecha:";
    titulos.appendChild(pFecha);

    const pTotal = document.createElement("p");
    pTotal.classList.add("interfazfacturas__titulonombre");
    pTotal.textContent = "Total:";
    titulos.appendChild(pTotal);

    const pPlaca = document.createElement("p");
    pPlaca.classList.add("interfazfacturas__titulonombre");
    pPlaca.textContent = "Placa:";
    titulos.appendChild(pPlaca);

    const pProductos = document.createElement("p");
    pProductos.classList.add("interfazfacturas__titulonombre");
    pProductos.textContent = "Productos consumidos:";
    titulos.appendChild(pProductos);

    // ---- Contenido ----
    const content = document.createElement("div");
    content.classList.add("interfazfacturas__contentCard");

    const facturaId = document.createElement("p");
    facturaId.classList.add("interfazfacturas__datos");
    facturaId.textContent = element.factura_id;

    const cliente = document.createElement("p");
    cliente.classList.add("interfazfacturas__datos");
    cliente.textContent = element.cliente || "Sin cliente";

    const empresa = document.createElement("p");
    empresa.classList.add("interfazfacturas__datos");
    empresa.textContent = element.empresa;

    const nit = document.createElement("p");
    nit.classList.add("interfazfacturas__datos");
    nit.textContent = element.nit;

    const direccion = document.createElement("p");
    direccion.classList.add("interfazfacturas__datos");
    direccion.textContent = element.direccion || "Sin dirección";

    const correo = document.createElement("p");
    correo.classList.add("interfazfacturas__datos");
    correo.textContent = element.correo || "Sin correo";

    const representante = document.createElement("p");
    representante.classList.add("interfazfacturas__datos");
    representante.textContent = element.representante_legal || "Sin representante";

    const fecha = document.createElement("p");
    fecha.classList.add("interfazfacturas__datos");
    fecha.textContent = `${element.fecha_emision[2]}/${element.fecha_emision[1]}/${element.fecha_emision[0]}`;

    const total = document.createElement("p");
    total.classList.add("interfazfacturas__datos");
    total.textContent = `$${element.total.toLocaleString('es-CO')}`;

    const placa = document.createElement("p");
    placa.classList.add("interfazfacturas__datos");
    placa.textContent = element.placa || "Sin placa";

    // ---- Lista de productos consumidos ----
    const consumidos = document.createElement("ul");
    consumidos.classList.add("interfazfacturas__datos");

    if (element.detalles && element.detalles.length > 0) {
      element.detalles.forEach(d => {
        const li = document.createElement("li");
        const subtotal = d.cantidad * d.precio_unitario;
        li.textContent = `${d.descripcion} - Cantidad: ${d.cantidad} - Precio: $${d.precio_unitario.toLocaleString('es-CO')} }`;
        consumidos.appendChild(li);
      });
    } else {
      const li = document.createElement("li");
      li.textContent = "Sin consumos";
      consumidos.appendChild(li);
    }

    // ---- Agregar datos a la card ----
    content.appendChild(facturaId);
    content.appendChild(cliente);
    content.appendChild(empresa);
    content.appendChild(nit);
    content.appendChild(direccion);
    content.appendChild(correo);
    content.appendChild(representante);
    content.appendChild(fecha);
    content.appendChild(total);
    content.appendChild(placa);
    content.appendChild(consumidos);

    // ---- Armamos la card ----
    infoWrapper.appendChild(titulos);
    infoWrapper.appendChild(content);
    card.appendChild(infoWrapper);
    seccionfactura.appendChild(card);
  })
};
///Crear Servicios Mecanico


export const MostrarselectsMecanicos = async () => {
  try {
    const data = await get(`FormDataReparacion`);
    const reparaciones = await get(`Reparaciones`)
    const selectVehiculos = document.getElementById("vehiculo_id");
    selectVehiculos.innerHTML = "";
    data.vehiculos.forEach(v => {
      const option = document.createElement("option");
      option.value = v.vehiculo_id;
      option.textContent = `${v.vehiculo_id} - ${v.placa}`;;
      selectVehiculos.appendChild(option);
    });

    // Recorrer servicios
    const selectServicios = document.getElementById("servicio_id");
    selectServicios.innerHTML = "";
    data.servicios.forEach(s => {
      const option = document.createElement("option");
      option.value = s.servicio_id;
      option.textContent = s.nombre_servicio;
      selectServicios.appendChild(option);
    });

    // Recorrer estados
    const selectEstados = document.getElementById("estado_id");
    selectEstados.innerHTML = "";
    data.estados.forEach(e => {
      const option = document.createElement("option");
      option.value = e.estado_id;
      option.textContent = e.nombre_estado;
      selectEstados.appendChild(option);
    });

    // Recorrer consumibles
    const selectConsumibles = document.getElementById("producto_id");
    selectConsumibles.innerHTML = "";
    data.productos.forEach(p => {
      const option = document.createElement("option");
      option.value = p.producto_id;
      option.textContent = p.nombre;
      selectConsumibles.appendChild(option);
    });

    const idsUnicos = [];
    const reparacionesUnicas = [];
    reparaciones.forEach(r => {
      if (!idsUnicos.includes(r.detalle_id)) {
        idsUnicos.push(r.detalle_id);
        reparacionesUnicas.push(r); // Guardamos el objeto completo
      }
    });

    const selectServicio = document.getElementById("detalle_id");
    selectServicio.innerHTML = "";
    reparacionesUnicas.forEach(r => {
      const option = document.createElement("option");
      option.value = r.detalle_id;
      option.textContent = `#${r.detalle_id} - ${r.nombre_servicio} - ${r.placa}`;
      selectServicio.appendChild(option);
    })

    const selectServiciofactura = document.getElementById("detalle_idfactura");
    selectServiciofactura.innerHTML = "";
    reparacionesUnicas.forEach(r => {
      const option = document.createElement("option");
      option.value = r.detalle_id;
      option.textContent = `#${r.detalle_id} - ${r.nombre_servicio} - ${r.placa}`;
      selectServiciofactura.appendChild(option);
    })

  } catch (error) {
    console.error(error);
    alert("Error al cargar los datos del formulario");
  }
}
export const EditarReparaciones = async (
  colServicio,
  colVehiculo,
  colEstado,
  colFecha,
  colProductos,
  colObservaciones,
  iconoeditar,
  element,
  data
) => {
  // Peticiones a la API
  const servicios = await get("Servicios");
  const vehiculos = await get("Vehiculos");
  const estados = await get("EstadoServicios");


  // Reemplazar solo la fila actual por inputs manteniendo la estructura
  const fila = colServicio.parentElement;
  // Servicio
  const inputServicio = document.createElement("select");
  inputServicio.classList.add("clienteModificacion__input");
  servicios.data.forEach(s => {
    const option = document.createElement("option");
    option.value = s.servicio_id;
    option.textContent = s.nombre_servicio;
    if (s.nombre_servicio === element.nombre_servicio) option.selected = true;
    inputServicio.appendChild(option);
  });
  colServicio.innerHTML = "";
  colServicio.appendChild(inputServicio);

  // Vehículo
  const inputVehiculo = document.createElement("select");
  inputVehiculo.classList.add("clienteModificacion__input");
  vehiculos.data.forEach(v => {
    const option = document.createElement("option");
    option.value = v.vehiculo_id;
    option.textContent = v.placa;
    if (v.placa === element.placa) option.selected = true;
    inputVehiculo.appendChild(option);
  });
  colVehiculo.innerHTML = "";
  colVehiculo.appendChild(inputVehiculo);

  // Estado
  const inputEstado = document.createElement("select");
  inputEstado.classList.add("clienteModificacion__input");
  estados.data.forEach(e => {
    const option = document.createElement("option");
    option.value = e.estado_id;
    option.textContent = e.nombre_estado;
    if (e.nombre_estado === element.nombre_estado) option.selected = true;
    inputEstado.appendChild(option);
  });
  colEstado.innerHTML = "";
  colEstado.appendChild(inputEstado);

  // Fecha
  const inputFecha = document.createElement("input");
  inputFecha.type = "date";
  inputFecha.classList.add("clienteModificacion__input");
  inputFecha.value = new Date(element.fecha).toISOString().split("T")[0];
  colFecha.innerHTML = "";
  colFecha.appendChild(inputFecha);

  // Observaciones
  const inputObservaciones = document.createElement("input");
  inputObservaciones.type = "text";
  inputObservaciones.classList.add("clienteModificacion__input");
  inputObservaciones.value = element.observaciones || "";
  colObservaciones.innerHTML = "";
  colObservaciones.appendChild(inputObservaciones);

  // Cambiar icono a guardar
  iconoeditar.classList.remove("bi-pencil");
  iconoeditar.classList.add("bi-check2");
  const nuevoIcono = iconoeditar.cloneNode(true);
  iconoeditar.replaceWith(nuevoIcono);

  // Guardar cambios
  nuevoIcono.addEventListener("click", async () => {
    if (!validarFechaMinima(inputFecha)) {
      await error("La fecha no puede ser menor que hoy.", "");
      location.reload();
      return;
    }

    const reparacionActualizada = {
      servicio_id: parseInt(inputServicio.value),
      vehiculo_id: parseInt(inputVehiculo.value),
      estado_id: parseInt(inputEstado.value),
      fecha: inputFecha.value,
      observaciones: inputObservaciones.value.trim(),
      nombre_mecanico: element.nombre_mecanico
    };

    try {
      const confirmacion = await confirm("¿Actualizar reparación?");
      if (confirmacion.isConfirmed) {
        const respuesta = await patch(`Reparaciones/${element.detalle_id}`, reparacionActualizada);
        if (respuesta.ok) {
          if ((await success({ message: "Reparación actualizada con éxito" })).isConfirmed) {
            location.reload();
          }
        } else {
          await error("No se pudo actualizar la reparación");
        }
      }
    } catch (err) {
      console.error("Error al actualizar reparación:", err);
      await error("Error inesperado al actualizar");
    }
  });
};

export const ElimarReparaciones = async (detalleId, consumibleId, usuario_id) => {
  try {
    const confirmacion = await eliminar("¿Desea eliminar esta reparación?");
    if (!confirmacion.isConfirmed) return;


    // 1. Eliminar factura si existe
    const facturasResponse = await get(`Facturas`);
    const factura = facturasResponse.data.find(f => f.usuario_id === usuario_id);
    if (factura) {
      const respFactura = await del(`facturas/${factura.factura_id}`);
      if (!respFactura.ok) {
        await error("No se pudo eliminar la factura asociada");
        return;
      }
    }

    // 2. Si consumibleId está definido, buscar el producto_id real para eliminar
    if (consumibleId !== null && consumibleId !== undefined) {
      // Obtener todos los consumibles de esta reparación
      const consumiblesResponse = await get(`ProductosConsumidos/${detalleId}`);
      const consumibles = consumiblesResponse.data;
      if (!Array.isArray(consumibles) || consumibles.length === 0) {
        await error("No hay consumibles para esta reparación");
        return;
      }
      console.log(consumibles);
      
      // Buscar el consumible que coincida con consumibleId que tienes (que imagino es el id del consumible)
      const consumible = consumibles.find(c => c.consumible_id === consumibleId);
      if (!consumible) {
        await error("Consumible no encontrado");
        return;
      }

      // Usar el producto_id para eliminar correctamente
      const productoId = consumible.producto_id;
      const respConsumible = await del(`Reparaciones/${detalleId}/consumibles/${productoId}`);
      if (!respConsumible.ok) {
        await error("No se pudo eliminar el producto consumible");
        return;
      }
    } else {
      // Aquí sigue el flujo para eliminar toda la reparación y sus consumibles
      const respReparacion = await del(`Reparaciones/${detalleId}`);
      if (!respReparacion.ok) {
        await error("No se pudo eliminar la reparación");
        return;
      }
    }

    const ok = await success({ message: "Reparación y factura eliminadas con éxito" });
    if (ok.isConfirmed) location.reload();

  } catch (err) {
    console.error("Error al eliminar la reparación:", err);
    await error("Error inesperado al eliminar");
  }
}


export const informacionServicios = (servicios) => {
  const contentServicios = document.querySelector(".servicios-listado")

  servicios.forEach(servicios => {
    const cards = document.createElement("div");
    cards.classList.add("info__servicios");

    const body = document.createElement("div");
    body.classList.add("listado__bodyservicios");

    // Contenedor de la info
    const info = document.createElement("div");
    info.classList.add("listado__infoServicios");

    // ---- Nombre ----
    const Nombres = document.createElement("div");
    Nombres.classList.add("listado__tituloServicios");

    const pnombre_servicios = document.createElement("div");
    pnombre_servicios.classList.add("listado__pnombre_servicios");
    pnombre_servicios.textContent = "Nombre del Servicio";
    Nombres.appendChild(pnombre_servicios);

    const nombre = document.createElement("p");
    nombre.classList.add("listadoServicios__textinfo");
    nombre.textContent = servicios.nombre_servicio;
    Nombres.appendChild(nombre);

    // ---- Descripción ----
    const descripciongrupo = document.createElement("div");
    descripciongrupo.classList.add("listado__tituloServicios");

    const descripcion = document.createElement("div");
    descripcion.classList.add("listado__pnombre_servicios");
    descripcion.textContent = "Descripción";
    descripciongrupo.appendChild(descripcion);

    const descTexto = document.createElement("p");
    descTexto.classList.add("listadoServicios__textinfo");
    descTexto.textContent = servicios.descripcion;
    descripciongrupo.appendChild(descTexto);

    // ---- Precio ----
    const precios = document.createElement("div");
    precios.classList.add("listado__tituloServicios");

    const preciotitle = document.createElement("div");
    preciotitle.classList.add("listado__pnombre_servicios");
    preciotitle.textContent = "Precio";
    precios.appendChild(preciotitle);

    const precio = document.createElement("p");
    precio.classList.add("listadoServicios__textinfo");
    precio.textContent = servicios.precio;
    precios.appendChild(precio);

    // Añadimos bloques al contenedor de info
    info.appendChild(Nombres);
    info.appendChild(descripciongrupo);
    info.appendChild(precios);

    // Armamos la tarjeta
    body.appendChild(info);
    cards.appendChild(body);
    contentServicios.appendChild(cards);
  })
}
export const mostrarVehiculosMecanico = (vehiculos, Usuarios) => {
  const seccionInfo = document.querySelector(".mecanicoVehiculos__content");

  vehiculos.forEach((element) => {
    const cards = document.createElement("div");
    cards.classList.add("mecanicovehiculos__cards");

    const body = document.createElement("div");
    body.classList.add("interfazvehiculos__body");

    const infoWrapper = document.createElement("div");
    infoWrapper.classList.add("interfazvehiculos__info");

    const titulos = document.createElement("div");
    titulos.classList.add("interfazvehiculos__contentCards");

    const pMarca = document.createElement("p");
    pMarca.classList.add("interfazvehiculos__titulonombre");
    pMarca.textContent = "Marca:";
    titulos.appendChild(pMarca);

    const pPlaca = document.createElement("p");
    pPlaca.classList.add("interfazvehiculos__titulonombre");
    pPlaca.textContent = "Placa:";
    titulos.appendChild(pPlaca);

    const pModelo = document.createElement("p");
    pModelo.classList.add("interfazvehiculos__titulonombre");
    pModelo.textContent = "Modelo:";
    titulos.appendChild(pModelo);

    const pUsuario = document.createElement("p");
    pUsuario.classList.add("interfazvehiculos__titulonombre");
    pUsuario.textContent = "Usuario:";
    titulos.appendChild(pUsuario);

    const content = document.createElement("div");
    content.classList.add("interfazvehiculos__contentCard");

    const nombre = document.createElement("p");
    nombre.classList.add("interfazvehiculos__marca");
    nombre.textContent = element.marca;

    const placa = document.createElement("p");
    placa.classList.add("interfazvehiculos__placa");
    placa.textContent = element.placa;

    const modelo = document.createElement("p");
    modelo.classList.add("interfazvehiculos__modelo");
    modelo.textContent = element.modelo;

    const usuarioId = document.createElement("p");
    usuarioId.classList.add("interfazvehiculos__usuarioId");

    const usuariosFiltrados = Usuarios.filter((usuario) => {
      // Verifica que el ID del usuario sea el mismo que el del elemento actual
      const mismoUsuario = usuario.usuario_id === element.usuario_id;

      // Verifica que el rol sea exactamente 2
      const esRolCliente = usuario.rol_id === 2;

      // Solo retorna aquellos que cumplan ambas condiciones
      return mismoUsuario && esRolCliente;
    });

    if (usuariosFiltrados.length > 0) {
      usuarioId.textContent = usuariosFiltrados[0].usuario;
    } else {

      usuarioId.textContent = "Sin usuario asignado";
    }

    content.appendChild(nombre);
    content.appendChild(placa);
    content.appendChild(modelo);
    content.appendChild(usuarioId);


    // Estructura final del card
    infoWrapper.appendChild(titulos);
    infoWrapper.appendChild(content);
    body.appendChild(infoWrapper);
    cards.appendChild(body);
    seccionInfo.appendChild(cards);
  });
}

//FACTURAS

export const generarFactura = async (reparacion) => {
  const response = await get(`FormDataReparacion`);
  // 1. Obtener usuario_id (si la reparación no lo trae)
  let usuarioId = reparacion.usuario_id;
  if (!usuarioId && reparacion.cliente) {
    const usuario = response.usuarios.find(u => u.nombre === reparacion.cliente);
    if (!usuario) return await error("No se encontró el usuario para esta reparación");
    usuarioId = usuario.usuario_id;
  }

  // 2. Calcular total de la reparación
  let total = 0;

  // Sumar productos usados
  reparacion.productos.forEach(p => {
    const productoCatalogo = response.productos.find(prod => prod.producto_id === p.producto_id);
    if (productoCatalogo) {
      total += productoCatalogo.precio * (p.cantidad || 1);
    }
  });

  // Sumar precio del servicio
  const servicioCatalogo = response.servicios.find(serv => serv.servicio_id === reparacion.servicio_id);
  if (servicioCatalogo) {
    total += servicioCatalogo.precio;
  }

  // Subtotal (si no hay impuestos separados)
  const subtotal = total;

  // 3. Construir objeto factura
  const factura = {
    usuario_id: usuarioId,
    empresa_id: 1, // ID del taller
    fecha_emision: new Date().toISOString().split('T')[0],
    subtotal: subtotal,
    total: total
  };

  // 4. Confirmar y enviar
  const confirmacion = await confirm("¿Desea crear la factura?");
  if (confirmacion.isConfirmed) {
    const respuesta = await post('facturas', factura);
    if (respuesta?.ok) {
      if ((await success({ message: "Factura registrada con éxito" })).isConfirmed) {
        location.reload();
      }
    } else {
      await error("No se pudo crear la factura", "");
    }
  }
}

export const contarCamposFormulario = (formulario) => {
  const campos = [...formulario.elements].filter(campo => campo.hasAttribute('required'));
  return campos.length;
};


export const validar = (event) => {
  event.preventDefault();

  const campos = [...event.target.elements].filter((item) => item.hasAttribute('required'));
  const inputText = campos.filter((campo) =>
    campo.tagName === 'INPUT' &&
    (campo.getAttribute('type') === 'text' || campo.getAttribute('type') === 'email')
  );
  const inputContrasenia = campos.filter((campo) =>
    campo.tagName === 'INPUT' && campo.getAttribute('type') === 'password'
  );
  const selects = campos.filter((campo) => campo.tagName === 'SELECT');
  const textAreas = campos.filter((campo) => campo.tagName === 'TEXTAREA');

  let info = {};

  inputText.forEach(campo => {
    const id = campo.getAttribute('id');
    if (validarMinimo(campo)) {
      if (id === 'correo') {
        if (validarCorreo(campo)) {
          info[id] = campo.value.toLowerCase();
        }
      } else if (id === 'cedula') {
        if (validarCedula(campo)) {
          info[id] = campo.value;
        }
      } else {
        info[id] = campo.value;
      }
    }
  });

  // Validar contraseña
  inputContrasenia.forEach(campo => {
    if (validarContrasenia(campo)) {
      info[campo.getAttribute('id')] = campo.value;
    }
  });

  // Validar selects
  selects.forEach(select => {
    if (select.value === "") {
      if (select.nextElementSibling) select.nextElementSibling.remove();
      const mensaje = document.createElement('span');
      mensaje.textContent = "Debe seleccionar un elemento";
      mensaje.classList.add("mensaje-error");
      select.insertAdjacentElement('afterend', mensaje);
      select.classList.add('border--red');
    } else {
      info[select.getAttribute('id')] = select.value;
    }
  });

  // Validar textarea 
  textAreas.forEach(textArea => {
    if (validarMinimo(textArea)) {
      info[textArea.getAttribute('id')] = textArea.value;
    }
  });

  return info;
};
export const validarCorreo = (campo) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const correo = campo.value.trim();
  if (!regex.test(correo)) {
    const mensaje = document.createElement('span');
    mensaje.textContent = "Correo inválido";
    mensaje.classList.add("mensaje-error");
    if (campo.nextElementSibling) campo.nextElementSibling.remove();
    campo.insertAdjacentElement('afterend', mensaje);
    campo.classList.add('border--red');
    return false;
  }
  return true;
};
export const validarCedula = (campo) => {
  const regex = /^\d{6,10}$/; // entre 6 y 10 números
  const cedula = campo.value.trim();

  if (!regex.test(cedula)) {
    if (campo.nextElementSibling) campo.nextElementSibling.remove();
    const mensaje = document.createElement('span');
    mensaje.textContent = "La cédula debe tener entre 6 y 10 dígitos.";
    mensaje.classList.add("mensaje-error");
    campo.insertAdjacentElement('afterend', mensaje);
    campo.classList.add('border--red');
    return false;
  }
  return true;
};
export const validarContrasenia = (campo) => {
  const texto = campo.value.trim();
  const regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.{5,})/;

  if (!regex.test(texto)) {
    const mensaje = document.createElement('span');
    mensaje.textContent = "La contraseña debe tener al menos 5 caracteres, una mayúscula y un número."; 3
    mensaje.classList.add("mensaje-error");

    if (campo.nextElementSibling) campo.nextElementSibling.remove();
    campo.insertAdjacentElement('afterend', mensaje);
    campo.classList.add('border--red');
    return false;
  }

  return true;
};
export const validarFormularioCompleto = (formulario) => {
  const camposRequeridos = [...formulario.elements].filter(el => el.hasAttribute('required'));
  let formularioCompleto = true;

  // Eliminar mensaje general previo si existe
  const mensajePrevio = formulario.querySelector('.mensaje-error-general');
  if (mensajePrevio) mensajePrevio.remove();

  camposRequeridos.forEach(campo => {
    const valor = campo.value.trim();
    if (!valor) {
      formularioCompleto = false;

      // Solo marca el campo si aún no tiene mensaje
      if (!campo.classList.contains('border--red')) {
        campo.classList.add('border--red');
      }
    } else {
      campo.classList.remove('border--red'); // Limpia el rojo si ya fue corregido
    }
  });
  return formularioCompleto; // true o false
};


export const limpiar = (campo) => {
  if (campo.nextElementSibling) campo.nextElementSibling.remove();
  campo.classList.remove('border--red');
};

export const validarLetras = (event) => {
  const tecla = event.key;

  const permitidas = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/;

  if (!permitidas.test(tecla) && tecla != "Backspace") {
    event.preventDefault();
  }
};

export const validarMinimo = (campo) => {
  const texto = campo.value.trim();
  let minimo = parseInt(campo.getAttribute('minlength') || campo.getAttribute('min') || "0");

  if (texto.length < minimo) {
    const span = document.createElement('span');
    span.textContent = `El campo ${campo.getAttribute('id')} debe tener mínimo ${minimo} caracteres`;
    span.classList.add("mensaje-error");
    if (campo.nextElementSibling) campo.nextElementSibling.remove();
    campo.insertAdjacentElement('afterend', span);
    campo.classList.add('border--red');
    return false;
  } else {
    if (campo.nextElementSibling) campo.nextElementSibling.remove();
    campo.classList.remove('border--red');
    return true;
  }
}

export const validarMaximo = (event) => {
  const campo = event.target;
  const max = campo.getAttribute('maxlength');

  if (max && campo.value.length >= max && event.key !== 'Backspace') {
    event.preventDefault();
  }
};

export const validarNumeros = (event) => {
  const tecla = event.key;

  const permitidas = /^[0-9]$/;

  if (!permitidas.test(tecla) && tecla != "Backspace") {
    event.preventDefault();
  }
};

export const validarPlacas = (event) => {
  const regex = /^[A-Za-z]{3}[0-9]{2}[A-Za-z]{1}$/;
  const placa = campo.value.trim()

  if (!regex.test(placa)) {
    const mensaje = document.createElement('span');
    mensaje.textContent = "Placa Invalida"
    mensaje.classList.add("mensaje-error")
    if (campo.nextElementSibling) campo.nextElementSibling.remove();
    campo.insertAdjacentElement('afterend', mensaje);
    campo.classList.add('border--red');
    return false;
  }
  return true;
}
export const recogerDatos = (form) => {
  const campos = [...form.elements].filter(item => item.hasAttribute('id') && item.hasAttribute('required'));
  let datos = {};
  campos.forEach(campo => datos[campo.id] = campo.value);
  return datos;
}

export const validarFechaMinima = (campo) => {
  const valor = campo.value;
  if (!valor) return false;

  const fechaSeleccionada = new Date(valor + "T00:00:00");
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  if (fechaSeleccionada < hoy) {
    let mensaje = campo.nextElementSibling;
    if (!mensaje || !mensaje.classList.contains("mensaje-error")) {
      mensaje = document.createElement('span');
      mensaje.classList.add("mensaje-error");
      campo.insertAdjacentElement('afterend', mensaje);
    }
    mensaje.textContent = "La fecha no puede ser menor que hoy";
    campo.classList.add('border--red');
    return false;
  } else {
    const mensaje = campo.nextElementSibling;
    if (mensaje && mensaje.classList.contains("mensaje-error")) {
      mensaje.remove();
    }
    campo.classList.remove('border--red');
    return true;
  }
}