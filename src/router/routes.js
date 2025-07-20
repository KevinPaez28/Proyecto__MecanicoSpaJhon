import homecontroller from '../views/Home/HomeController.js'
import registerController from '../views/Signup/RegisterController.js'
import AdminPrincipal from '../views/Auth/administrador/Principal/AdminPrincipal.js'
import RegisterEmpleados from '../views/Auth/administrador/RegisterEmpleado/RegisterEmpleados.js'
import VehiculosAdmin from '../views/Auth/administrador/VehiculosAdmin/VehiculosAdmin.js'
import AdminCategoria from '../views/Auth/administrador/CategoriasProductos/AdminCategoria.js'

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
     Admin: {
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
      }
    }
}
