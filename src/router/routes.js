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
import { EditarEmpleados } from '../views/Auth/administrador/Empleados/Editar/EditarEmpleados.js'
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
    Empleados: {
      "/": {
        path: `Auth/administrador/Empleados/index.html`,
        controller: ListarEmpleados,
        private: true
      },
      Crear: {
        path: `Auth/administrador/Empleados/Crear/index.html`,
        controller: CrearEmpleados,
        private: true
      },
      editar:{ 
        path: `Auth/administrador/Editar/index.html`,
        Controller: EditarEmpleados,
        private: true
      }
    },
    RegisterVehiculos: {
      path: `Auth/administrador/VehiculosAdmin/index.html`,
      controller: VehiculosAdmin,
      private: true
    },
    CategoriasProductos: {
      path: `Auth/administrador/CategoriasProductos/index.html`,
      controller: AdminCategoria,
      private: true
    },
    Servicios: {
      path: `Auth/administrador/Servicios/index.html`,
      controller: servicios,
      private: true
    },
    factura: {
      path: `Auth/administrador/Factura/index.html`,
      controller: factura,
      private: true,
    }
  },
  cliente: {
    principal: {
      path: `Auth/usuarios/Principal/index.html`,
      controller: principalUsuario,
      private: true
    },
    informacion: {
      path: `Auth/usuarios/Informacion/index.html`,
      controller: informacionUsuario,
      private: true
    },
    servicios: {
      path: `Auth/usuarios/servicios/index.html`,
      controller: serviciosUsuarios,
      private: true,
    },
    historial: {
      path: `Auth/usuarios/HistorialServicios/index.html`,
      controller: HistorialServicios,
      private: true,
    }

  },
  mecanico: {
    principal: {
      path: `Auth/Mecanico/Principal/index.html`,
      controller: principalMecanico,
      private: true
    },
    Vehiculos: {
      path: `Auth/Mecanico/Vehiculos/index.html`,
      controller: vehiculosMecanico,
      private: true
    },
    informacion: {
      path: `Auth/Mecanico/informacion/index.html`,
      controller: informacionMecanico,
      private: true
    }
  }
}
