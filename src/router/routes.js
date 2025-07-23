import homecontroller from '../views/Home/HomeController.js'
import registerController from '../views/Signup/RegisterController.js'
import AdminPrincipal from '../views/Auth/administrador/Principal/AdminPrincipal.js'
import RegisterEmpleados from '../views/Auth/administrador/RegisterEmpleado/RegisterEmpleados.js'
import VehiculosAdmin from '../views/Auth/administrador/VehiculosAdmin/VehiculosAdmin.js'
import AdminCategoria from '../views/Auth/administrador/CategoriasProductos/AdminCategoria.js'
import principalUsuario from '../views/Auth/usuarios/Principal/principalUsuario.js'
import servicios from  '../views/Auth/administrador/Servicios/servicios.js'
import informacionUsuario from '../views/Auth/usuarios/Informacion/informacionUsuario.js'
import principalMecanico from '../views/Auth/Mecanico/principal/principalMecanico.js'

export const routes = {
    Home:{
        path: "Home/index.html",
        controller: homecontroller,
        private: false
    },
    Signup:{
        path:"Signup/index.html",
        controller: registerController,
        private: false
    },
     administrador: {
      principal: {
        path: `Auth/administrador/Principal/index.html`,
        controller: AdminPrincipal,
        private: true
      },
      RegisterEmpleados : {
        path: `Auth/administrador/RegisterEmpleado/index.html`,
        controller: RegisterEmpleados,
        private: true
      },
      RegisterVehiculos:{
        path: `Auth/administrador/VehiculosAdmin/index.html`,
        controller: VehiculosAdmin,
        private: true
      },
      CategoriasProductos:{
       path: `Auth/administrador/CategoriasProductos/index.html`,
       controller: AdminCategoria,
       private: true
      },
      Servicios:{
       path: `Auth/administrador/Servicios/index.html`,
       controller: servicios,

      }
    },
    cliente:{
      principal:{
       path: `Auth/usuarios/Principal/index.html`,
       controller: principalUsuario,
       private: true
      } ,
      informacion:{
       path: `Auth/usuarios/Informacion/index.html`,
       controller: informacionUsuario,
       private: true 
      }
    },
    mecanico:{
     principal:{
      path: `Auth/Mecanico/Principal/index.html`,
      controller: principalMecanico,
      private: true 
     }
    }
}
