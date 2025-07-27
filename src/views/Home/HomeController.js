import { error, success } from "../../Helpers/alertas.js";
import { get , login} from "../../Helpers/api.js";
import "../../Styles/Home.css";

export default (parametros = null) => {
    const formulario = document.querySelector("#formulario");
    if (formulario.dataset.listener === "true") {
    return;
    }
    formulario.addEventListener("submit", async (event) => {
      event.preventDefault();

      const usuario = document.getElementById("usuario");
      const contrasenia = document.getElementById("contrasenia");

      if (!usuario || !contrasenia) {
        alert("Faltan campos en el formulario.");
        return;
      }

      const usuariovalor = usuario.value.trim();
      const contraseniavalor = contrasenia.value.trim();

    try {
      const usuarios = await get("Usuarios");
      const roles = await get("Roles");

      const user = usuarios.find((usu) => usu.usuario === usuariovalor);
      if (!user) {
      await error("Usuario incorrecto");
      return;
      }
      const contrasena = usuarios.find((usu) => usu.contrasena === contraseniavalor);
      if (!contrasena) {
      await error("Contraseña incorrecta");
      return;
      }
      const rolUsuario = roles.find((rol) => rol.rol_id === user.rol_id);

      const { token } = await login(usuariovalor, contraseniavalor);

      if (!token) {
        await error("Datos incorrectos");
      } else {
        localStorage.setItem("token", token);
        localStorage.setItem("usuario", JSON.stringify(user));
        success({ message: "Usuario iniciado correctamente" });

        // Generar nombre de ruta dinámicamente, ej: "Administrador" → "admin"
        const rutaRol = rolUsuario.nombre.toLowerCase();

        // Redirigir usando el nombre del rol como parte de la ruta
        location.hash = `#/${rutaRol}/principal?id=${user.usuario_id}`;
      }  // Guarda token y usuario en localStorage
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
    });
  
};


  