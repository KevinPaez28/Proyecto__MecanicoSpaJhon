import homecontroller from '../views/Home/HomeController.js'
import registerController from '../views/Signup/RegisterController.js'
import AdminPrincipal from '../views/Auth/administrador/Principal/AdminPrincipal.js'
import CrearEmpleados from '../views/Auth/administrador/Empleados/Crear/CrearUsuario.js'
import VehiculosAdmin from '../views/Auth/administrador/VehiculosAdmin/VehiculosAdmin.js'
import AdminCategoria from '../views/Auth/administrador/CategoriasProductos/AdminCategoria.js'
import principalUsuario from '../views/Auth/usuarios/Principal/principalUsuario.js'
import servicios from '../views/Auth/administrador/Servicios/servicios.js'
import informacionUsuario from '../views/Auth/usuarios/Informacion/informacionUsuario.js'
import principalMecanico from '../views/Auth/Mecanico/principal/principalMecanico.js'
import serviciosUsuarios from "../views/Auth/usuarios/servicios/serviciosUsuarios.js"
import vehiculosMecanico from '../views/Auth/Mecanico/Vehiculos/vehiculosMecanico.js'
import informacionMecanico from '../views/Auth/Mecanico/informacion/informacion.js'
import HistorialServicios from '../views/Auth/usuarios/HistorialServicios/HistorialServicios.js'
import factura from '../views/Auth/administrador/Factura/factura.js'
import ListarEmpleados from '../views/Auth/administrador/Empleados/ListarEmpleados.js'
import EditarEmpleados from '../views/Auth/administrador/Empleados/Editar/EditarEmpleados.js'
import crearvehiculos from '../views/Auth/administrador/VehiculosAdmin/crear/crearvehiculos.js'
import editarvehiculos from '../views/Auth/administrador/VehiculosAdmin/editar/editarvehiculos.js'
import crearcategorias from '../views/Auth/administrador/CategoriasProductos/Crear/crearCategorias.js'
import CrearProductos from '../views/Auth/administrador/Productos/Crear/crearProductos.js'
import editarproductos from '../views/Auth/administrador/Productos/editar/editarproductos.js'
import editarservicios from '../views/Auth/administrador/Servicios/editar/editarservicios.js'
import crearServicio from '../views/Auth/administrador/Servicios/crear/crearServicio.js'
import CrearFacturas  from '../views/Auth/Mecanico/Facturas/Crear/facturas.js'
import crearservicios from '../views/Auth/Mecanico/Reparaciones/Crear/crearservicios.js'
import consumibles from '../views/Auth/Mecanico/Consumibbles/Crear/consumibles.js'
export const routes = {
  Home: {
    path: "Home/index.html",
    controller: homecontroller,
    private: false
  },
  Signup: {
    path: "Signup/index.html",
    controller: registerController,
    private: false
  },
  administrador: {
    principal: {
      path: `Auth/administrador/Principal/index.html`,
      controller: AdminPrincipal,
      private: true
    },

  },
  cliente: {
    principal: {
      path: `Auth/usuarios/Principal/index.html`,
      controller: principalUsuario,
      private: true
    }
  },
  mecanico: {
    principal: {
      path: `Auth/Mecanico/Principal/index.html`,
      controller: principalMecanico,
      private: true
    }
  },
  Empleados: {
    "/": {
      path: `Auth/administrador/Empleados/index.html`,
      controller: ListarEmpleados,
      private: true,
      can: "Usuarios_Listar"
    },
    Crear: {
      path: `Auth/administrador/Empleados/Crear/index.html`,
      controller: CrearEmpleados,
      private: true,
      can: "Usuarios_Crear"
    },
    editar: {
      path: `Auth/administrador/Empleados/Editar/index.html`,
      controller: EditarEmpleados,
      private: true,
      can: "Usuarios_Actualizar"
    }
  },
  Vehiculos: {
    "/": {
      path: `Auth/administrador/VehiculosAdmin/index.html`,
      controller: VehiculosAdmin,
      private: true,
      can: "Vehiculos_Listar"
    },
    crear: {
      path: `Auth/administrador/VehiculosAdmin/crear/index.html`,
      controller: crearvehiculos,
      private: true,
      can: "Vehiculos_Crear"
    },
    editar: {
      path: `Auth/administrador/VehiculosAdmin/editar/index.html`,
      controller: editarvehiculos,
      private: true,
      can: "Vehiculos_Actualizar"
    }
  },
  Categorias: {
    "/": {
      path: `Auth/administrador/CategoriasProductos/index.html`,
      controller: AdminCategoria,
      private: true,
      can: "Categorias_Listar"
    },
    crear: {
      path: `Auth/administrador/CategoriasProductos/crear/index.html`,
      controller: crearcategorias,
      private: true,
      can: "Categorias_Crear"
    }
  },
  Productos: {
    crear: {
      path: `Auth/administrador/Productos/Crear/index.html`,
      controller: CrearProductos,
      private: true,
      can: "Productos_Crear"
    },
    editar: {
      path: `Auth/administrador/Productos/Editar/index.html`,
      controller: editarproductos,
      private: true,
      can: "Productos_Actualizar"
    }
  },
  Servicios: {
    "/": {
      path: `Auth/administrador/Servicios/index.html`,
      controller: servicios,
      private: true,
      can: "Servicios_Listar"
    },
    crear: {
      path: `Auth/administrador/Servicios/crear/index.html`,
      controller: crearServicio,
      private: true,
      can: "Servicios_Crear"
    },
    editar: {
      path: `Auth/administrador/Servicios/editar/index.html`,
      controller: editarservicios,
      private: true,
      can: "Servicios_Actualizar"
    }
  },
  factura: {
    "/": {
      path: `Auth/administrador/Factura/index.html`,
      controller: factura,
      private: true,
    },
    crear: {
      path: `Auth/Mecanico/Facturas/Crear/index.html`,
      controller: CrearFacturas,
      private: true,
    }
  },
  Reparaciones: {
    crear: {
      path: `Auth/Mecanico/Reparaciones/Crear/index.html`,
      controller: crearservicios,  
      private: true,
    },
    editar: {

    }
  },
  consumibles:{
    crear: {
      path: `Auth/Mecanico/Consumibbles/Crear/index.html`,
      controller: consumibles,
      private: true,
    }
  },
  informacion: {
    path: `Auth/usuarios/Informacion/index.html`,
    controller: informacionUsuario,
    private: true
  },
  historial: {
    path: `Auth/usuarios/HistorialServicios/index.html`,
    controller: HistorialServicios,
    private: true,
  },


}
