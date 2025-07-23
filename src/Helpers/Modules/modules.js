import { get , del, put } from "../api.js";
import { confirm ,success,error,eliminar} from "../alertas.js";
export const ObtenerUsuariosNombreCedulaROl = (Roles, usuarios) =>  {
  try {
    if (!usuarios || !Array.isArray(usuarios)) {
      throw new Error("No se pudo obtener la lista de usuarios.");
    }

    const empleados = document.querySelector(".menu__empleados-contenido");
    empleados.innerHTML = ""
    usuarios.forEach(element => {
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

      const rolEncontrado = Roles.find(r => r.rol_id == element.rol_id);
      pRol.textContent = rolEncontrado ? rolEncontrado.nombre : "Desconocido";

      empleados_content.appendChild(pNombre);
      empleados_content.appendChild(pCedula);
      empleados_content.appendChild(pRol);

      empleados.appendChild(empleados_content);
    });

  } catch (error) {
    console.error('Error al obtener usuarios:', error);
  }
}


export const TotalDeClientes = (usuarios) => {
  const elementosMenuNumbers = document.querySelectorAll('.menu__numbers');
  if (!elementosMenuNumbers || elementosMenuNumbers.length === 0) return;
  const clientesFiltrados = usuarios.filter(usuario => usuario.rol_id === 2);
  elementosMenuNumbers[0].textContent = clientesFiltrados.length;
};
export const ModificarUsuarios = (usuarios, Roles) => {
  try {
    const dialogo = document.getElementById("EliminarUsuario");
    const contenido = document.querySelector(".EliminarUsuario__Content");

    contenido.innerHTML = "";

    const encabezado = document.createElement("div");
    encabezado.classList.add("Menu__empleados-header");

    const nombre__content = document.createElement("p");
    nombre__content.classList.add("Menu__empleados-titulos");
    nombre__content.textContent = "Nombre";

    const cedula__content = document.createElement("p");
    cedula__content.classList.add("Menu__empleados-titulos");
    cedula__content.textContent = "Cédula";

    const telefono = document.createElement("p");
    telefono.classList.add("Menu__empleados-titulos");
    telefono.textContent = "Teléfono";

    const usuariotext = document.createElement("p");
    usuariotext.classList.add("Menu__empleados-titulos");
    usuariotext.textContent = "Usuario";

    const rol__content = document.createElement("p");
    rol__content.classList.add("Menu__empleados-titulos");
    rol__content.textContent = "Rol";

    encabezado.appendChild(nombre__content);
    encabezado.appendChild(cedula__content);
    encabezado.appendChild(telefono);
    encabezado.appendChild(usuariotext);
    encabezado.appendChild(rol__content);

    contenido.appendChild(encabezado);

    usuarios.forEach(usuario => {
      const fila = document.createElement("div");
      fila.classList.add("empleadosContent");

      const datosDiv = document.createElement("div");
      datosDiv.classList.add("empleadosContent__info");

      const nombre = document.createElement("p");
      nombre.classList.add("empleadosContent__datos");
      nombre.textContent = usuario.nombre;

      const cedula = document.createElement("p");
      cedula.classList.add("empleadosContent__datos");
      cedula.textContent = usuario.cedula;

      const telefono = document.createElement("p");
      telefono.classList.add("empleadosContent__datos");
      telefono.textContent = usuario.telefono;

      const usuarioText = document.createElement("p");
      usuarioText.classList.add("empleadosContent__datos");
      usuarioText.textContent = usuario.usuario;

      const rol = document.createElement("p");
      rol.classList.add("empleadosContent__datos");
      const encontrado = Roles.find(r => r.rol_id === usuario.rol_id);
      rol.textContent = encontrado ? encontrado.nombre : "Desconocido";

      datosDiv.appendChild(nombre);
      datosDiv.appendChild(cedula);
      datosDiv.appendChild(telefono);
      datosDiv.appendChild(usuarioText);
      datosDiv.appendChild(rol);

      const accionesDiv = document.createElement("div");
      accionesDiv.classList.add("empleadosContent__acciones");

      const btnEditar = document.createElement("button");
      btnEditar.textContent = "Editar";
      btnEditar.classList.add("btn-modificar");

      const btnEliminar = document.createElement("button");
      btnEliminar.textContent = "Eliminar";
      btnEliminar.classList.add("btn-Eliminar");

      btnEliminar.addEventListener("click", () => {
        eliminarUsuarioPorId(usuario.usuario_id);
      });

      btnEditar.addEventListener("click", async () =>{
        editarUsuarios(nombre,cedula,telefono,usuarioText,btnEditar,usuario.usuario_id,usuario.correo,usuario.contrasena,usuario.rol_id)
      });
      accionesDiv.appendChild(btnEditar);
      accionesDiv.appendChild(btnEliminar);

      fila.appendChild(datosDiv);
      fila.appendChild(accionesDiv);

      contenido.appendChild(fila);
    });

    dialogo.showModal();

  } catch (error) {
    console.error("Error al mostrar usuarios para eliminar:", error);
  }
};
export const editarUsuarios = async (nombre,cedula,telefono,usuarioText,btnEditar,id,correo,contrasena,rol) =>{
  const dialog = document.getElementById("EliminarUsuario")
  const inputNombre = document.createElement("input");
  inputNombre.classList.add("empleadosContent__input");
  inputNombre.value = nombre.textContent;
  nombre.replaceWith(inputNombre); 

  const inputCedula = document.createElement("input");
  inputCedula.classList.add("empleadosContent__input");
  inputCedula.value = cedula.textContent;
  cedula.replaceWith(inputCedula);

  const inputTelefono = document.createElement("input");
  inputTelefono.classList.add("empleadosContent__input");
  inputTelefono.value = telefono.textContent;
  telefono.replaceWith(inputTelefono);

  const inputUsuario = document.createElement("input");
  inputUsuario.classList.add("empleadosContent__input");
  inputUsuario.value = usuarioText.textContent;
  usuarioText.replaceWith(inputUsuario);

  btnEditar.textContent = "Guardar";
  btnEditar.classList.remove("btn-modificar");
  btnEditar.classList.add("btn-guardar");

  btnEditar.addEventListener("click", async () => {
        const nuevoUsuario = {
          nombre: inputNombre.value.trim(),
          cedula: inputCedula.value.trim(),
          telefono: inputTelefono.value.trim(),
          usuario: inputUsuario.value.trim(),
          correo: correo,       
          contrasena: contrasena,
          rol_id: rol
        };
    const paramns = id;
    try {
    const respuesta = await put(`Usuarios/${paramns}`, nuevoUsuario);
    dialog.close()
    const confirmacion = await confirm("Actualizar")

     if(confirmacion.isConfirmed){
      if((await success({ message: "Usuario Actualizado con exito"})).isConfirmed){
        if (respuesta.ok) {
          location.reload();  
        } else {
           await error("No se pudo actualizar el usuario");
        }
      }
     }
    } catch (error) {
      console.error("Error al actualizar usuario:", nuevoUsuario);
       await error(" Error inesperado al actualizar");
    }
  });
};
export const eliminarUsuarioPorId = async (id) => {
  const dialog= document.getElementById("EliminarUsuario")
    try {  
        dialog.close();
        const confirm = await eliminar("¿Deseas eliminar el usuario?");
        if (confirm.isConfirmed) {
          const respuesta = await del(`Usuarios/${id}`);
          
          if (respuesta.ok) {
            const ok = await success({ message: "Usuario eliminado con éxito" });
            if (ok.isConfirmed) {
              location.reload();
            }
          } else {
            await error("No se pudo eliminar el usuario");
          }
        }
    } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    await error("Error inesperado al eliminar");
  }
};


export const Vehiculos = (vehiculos, Usuarios) => {
  const seccionInfo = document.querySelector(".interfazVehiculos__content");

  vehiculos.forEach((element) => {
    const cards = document.createElement("div");
    cards.classList.add("interfazvehiculos__cards");

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

    // Crear contenedor de botones y colocarlo FUERA del contentCard
    const botones = document.createElement("div");
    botones.classList.add("interfazvehiculos__button");

    const btnEditar = document.createElement("button");
    btnEditar.classList.add("interfazvehiculos__buttones");
    btnEditar.textContent = "Editar";
    btnEditar.dataset.id = element.vehiculo_id;
    btnEditar.dataset.usuarioId = element.usuario_id;

    const btnEliminar = document.createElement("button");
    btnEliminar.classList.add("interfazvehiculos__buttones");
    btnEliminar.textContent = "Eliminar";

    botones.appendChild(btnEditar);
    botones.appendChild(btnEliminar);

    btnEliminar.addEventListener("click" , () =>{
      EliminarVehiculos(element.vehiculo_id)
    })

    btnEditar.addEventListener("click", () => {
      EditarVehiculos(nombre, placa, modelo, btnEditar);
    });

    
    // Estructura final del card
    infoWrapper.appendChild(titulos);
    infoWrapper.appendChild(content);
    body.appendChild(infoWrapper);
    body.appendChild(botones); // AQUI se agregan fuera del info
    cards.appendChild(body);
    seccionInfo.appendChild(cards);
  });
};
export const EliminarVehiculos = async (id) =>{
  console.log(id)
  try {
    const confirm = await eliminar ("Desea eliminar la informacion del Vehiculo?")
    if(confirm.isConfirmed){
      const respuesta = await del(`Vehiculos/${id}`)
      if (respuesta.ok) {
        const ok = await success({ message: "Informacion eliminada con éxito" });
        if (ok.isConfirmed) {
          location.reload();
        }
      } else {
        await error("No se pudo eliminar la informacion");
      }
    }
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    await error("Error inesperado al eliminar");
  }
};
export const EditarVehiculos = (nombre, placa, modelo, btnEditar) =>{
   const inputMarca = document.createElement("input");
    inputMarca.classList.add("inputEditar");
    inputMarca.value = nombre.textContent;

    const inputPlaca = document.createElement("input");
    inputPlaca.classList.add("inputEditar");
    inputPlaca.value = placa.textContent;

    const inputModelo = document.createElement("input");
    inputModelo.classList.add("inputEditar");
    inputModelo.value = modelo.textContent;

    nombre.replaceWith(inputMarca);
    placa.replaceWith(inputPlaca);
    modelo.replaceWith(inputModelo);

    btnEditar.textContent = "Guardar";

    btnEditar.addEventListener("click", async () => {
        const EditarVehiculo = {
        marca: inputMarca.value.trim(),
        placa: inputPlaca.value.trim(),
        modelo: inputModelo.value.trim(),
        usuario_id: btnEditar.dataset.usuarioId
      };
      try {
        const respuesta = await put(`Vehiculos/${btnEditar.dataset.id}`, EditarVehiculo);

        const confirmacion = await confirm("actualizar")

        if(confirmacion.isConfirmed){
          if((await success({ message: "Vehiculo Actualizado con exito"})).isConfirmed){
            if (respuesta.ok) {
            location.reload();
            } else {
              alert("Error al actualizar vehículo");
            }
          }
        }
        
      } catch (error) {
        console.error("Error:", error);
        alert("Error inesperado");
      }
   });
};



export const Categorias_Productos = (Categorias, Productos, select, contenedorPadre) => {
  Categorias.forEach(element => {
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

    const productosFiltrados = Productos.filter(p => p.categoria_id == element.categoria_id);
    if (productosFiltrados.length > 0) {
      productosFiltrados.forEach(p => {
       
        const divProducto = document.createElement("div");
        divProducto.classList.add("interfazcategorias__productos_item");

        const stock = document.createElement("p");
        stock.textContent = p.stock;

        const nombreProducto = document.createElement("p");
        nombreProducto.textContent = p.nombre;

        const precio = document.createElement("p");
        precio.textContent = p.precio;

        divProducto.append(stock, nombreProducto, precio);
        productos.appendChild(divProducto);

        btnEditar.addEventListener("click" , async (e) =>{
        e.preventDefault();
        editarProductos(stock,nombreProducto,precio,btnEditar,p.producto_id,element.categoria_id)
      })
      });
    } else {
      const sinProductos = document.createElement("em");
      sinProductos.textContent = "No hay productos";
      productos.appendChild(sinProductos);
    }

    const botones = document.createElement("div");
    botones.classList.add("interfazcategorias__button");

    const btnEliminar = document.createElement("button");
    btnEliminar.classList.add("interfazcategorias__buttones");
    btnEliminar.textContent = "Eliminar";

    botones.append(btnEditar, btnEliminar);

    body.append(nombre, productos, botones);
    card.appendChild(body);
    contenedorPadre.appendChild(card); 

    const option = document.createElement("option");
    option.value = element.categoria_id;
    option.textContent = element.nombre;
    select.appendChild(option);
  });
};
export const editarProductos = (stock,nombreProducto,precio,btnEditar,id,id_categoria) =>{
  const inputNombre = document.createElement("input");
  inputNombre.classList.add("Categorias__input");
  inputNombre.value = nombreProducto.textContent;
  nombreProducto.replaceWith(inputNombre)

  const inputStock = document.createElement("input");
  inputStock.classList.add("Categorias__input");
  inputStock.value = stock.textContent;
  stock.replaceWith(inputStock)

  const inputPrecio = document.createElement("input");
  inputPrecio.classList.add("Categorias__input");
  inputPrecio.value = precio.textContent;
  precio.replaceWith(inputPrecio)

  btnEditar.textContent = "Guardar";
  btnEditar.classList.remove("btn-modificar");
  btnEditar.classList.add("btn-guardar");

  btnEditar.addEventListener("click", async (e) => {
  e.preventDefault();
      const nuevaCategoria = {
      nombre:inputNombre.value.trim(),
      precio:inputPrecio.value.trim(),
      stock:inputStock.value.trim(),
      categoria_id : id_categoria
    }
    console.log(nuevaCategoria)
    const paramns = id; 
    try {
      const confirmacion = await confirm("Actualizar")
      if (confirmacion.isConfirmed) {
        const respuesta = await put(`Productos/${paramns}`, nuevaCategoria)
        if (respuesta.ok) {
            const ok = await success({ message: "Informacion Actualizada con éxito" });
          if (ok.isConfirmed){
            location.reload()
          }else{
            await error("No se pudo actualizar la Categoria")
          }
        }
      }else{
      } 
    } catch (error) {
      console.error("Error al actualizar Categoria:", nuevaCategoria);
       await error(" Error inesperado al actualizar");
    }
  })
};



export const VehiculosPorId = (vehiculos,Usuarios) =>{

  const seccionInfo = document.querySelector(".VehiculosUsuariosId");
  seccionInfo.innerHTML = "";

  vehiculos.forEach((element) => {
    const cards = document.createElement("div");
    cards.classList.add("vehiculosUsuarios");

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

    const usuariosFiltrados = Usuarios.filter(
      (v) => v.usuario_id === element.usuario_id && v.rol_id === 2
    );

    usuarioId.textContent =
      usuariosFiltrados.length > 0
        ? usuariosFiltrados[0].usuario
        : "Sin usuario asignado";

    content.appendChild(nombre);
    content.appendChild(placa);
    content.appendChild(modelo);
    content.appendChild(usuarioId);

    // Crear contenedor de botones y colocarlo FUERA del contentCard
    const botones = document.createElement("div");
    botones.classList.add("Usuarios__buttones");

    const btnEditar = document.createElement("button");
    btnEditar.classList.add("usuarios__button");
    btnEditar.textContent = "Editar";
    btnEditar.dataset.id = element.vehiculo_id;
    btnEditar.dataset.usuarioId = element.usuario_id;

    const btnEliminar = document.createElement("button");
    btnEliminar.classList.add("usuarios__button");
    btnEliminar.textContent = "Eliminar";

    botones.appendChild(btnEditar);
    botones.appendChild(btnEliminar);

    btnEliminar.addEventListener("click" , () =>{
      EliminarVehiculos(element.vehiculo_id)
    })

    btnEditar.addEventListener("click", () => {
      EditarVehiculos(nombre, placa, modelo, btnEditar);
    });

    
    // Estructura final del card
    infoWrapper.appendChild(titulos);
    infoWrapper.appendChild(content);
    body.appendChild(infoWrapper);
    body.appendChild(botones); // AQUI se agregan fuera del info
    cards.appendChild(body);
    seccionInfo.appendChild(cards);
  });
}

export const Clientesbyid = async () =>{
  const content = document.querySelector(".infodatos")
  const title = document.querySelector(".titleNombre") 
  const buttons = document.querySelector(".contentbuttons") 
  const id = localStorage.getItem("usuarioid");
  const Usuarios = await get (`Usuarios/${id}`)

  const infonombre = document.createElement("p")
  infonombre.classList.add("infotitlename")
  infonombre.textContent = Usuarios.nombre

  const infocedula = document.createElement("p")
  infocedula.classList.add("infotext")
  infocedula.textContent = Usuarios.cedula;

  const infocorreo = document.createElement("p")
  infocorreo.classList.add("infotext")
  infocorreo.textContent = Usuarios.correo

  const infotelefono = document.createElement("p")
  infotelefono.classList.add("infotext")
  infotelefono.textContent = Usuarios.telefono

  const infousuario = document.createElement("p")
  infousuario.classList.add("infotext")
  infousuario.textContent = Usuarios.usuario

  const infoconstrasena = document.createElement("p")
  infoconstrasena.classList.add("infotext")
  infoconstrasena.textContent = Usuarios.contrasena

  const btnEditar = document.createElement("button");
  btnEditar.textContent = "Editar";
  btnEditar.classList.add("btnUsuarios");

  const btnEliminar = document.createElement("button");
  btnEliminar.textContent = "Eliminar";
  btnEliminar.classList.add("btnUsuarios");

  btnEditar.addEventListener("click", async (e)=>{
    e.preventDefault();
    EditarClientes(infocedula,infocorreo,infotelefono,infousuario,infoconstrasena,btnEditar)
   })

  title.appendChild(infonombre)
  content.appendChild(infocedula)
  content.appendChild(infocorreo)
  content.appendChild(infoconstrasena)
  content.appendChild(infotelefono)
  content.appendChild(infousuario)


  buttons.appendChild(btnEditar)
  buttons.appendChild(btnEliminar)
}

export const  EditarClientes =(infocedula,infocorreo,infotelefono,infousuario,infoconstrasena,btnEditar) =>{
  
}



export const MostrarServicios = async (servicios) =>{
  const contentServicios = document.querySelector(".servicios-listado")

  servicios.forEach(servicios => {
    const cards = document.createElement("div");
    cards.classList.add("listado__cardservicios");

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

    // ---- Botones ----
    const botones = document.createElement("div");
    botones.classList.add("listadoServicios__button");

    const btnEliminar = document.createElement("button");
    btnEliminar.classList.add("listadoServicios__buttones");
    btnEliminar.textContent = "Eliminar";
    botones.appendChild(btnEliminar);

    const btneditar = document.createElement("button");
    btneditar.classList.add("listadoServicios__buttones");
    btneditar.textContent = "Editar";
    botones.appendChild(btneditar);

    // Armamos la tarjeta
    body.appendChild(info);
    body.appendChild(botones);
    cards.appendChild(body);
    contentServicios.appendChild(cards);
  });
}
//VALIDACIONES 

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
    mensaje.textContent = "La contraseña debe tener al menos 5 caracteres, una mayúscula y un número.";3
    mensaje.classList.add("mensaje-error");

    if (campo.nextElementSibling) campo.nextElementSibling.remove();
    campo.insertAdjacentElement('afterend', mensaje);
    campo.classList.add('border--red');
    return false;
  }

  return true;
};

export const limpiar = (campo) => {
  if (campo.nextElementSibling) campo.nextElementSibling.remove();
  campo.classList.remove('border--red');
};

export const validarLetras = (event) => {
  const tecla = event.key;

  const permitidas = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/;

  if (!permitidas.test(tecla) && tecla!="Backspace" ) {
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

  if (!permitidas.test(tecla) && tecla!="Backspace") {
    event.preventDefault();
  }
};

export const validarPlacas = (event) =>{
  const regex = /^[A-Za-z]{3}[0-9]{2}[A-Za-z]{1}$/;
  const placa = campo.value.trim()

  if(!regex.test(placa)){
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