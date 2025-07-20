import { get , login} from "../../Helpers/api.js";
import "../../Styles/Home.css";

export default (parametros = null) => {
    console.log("Se hizo clic en el botón de Iniciar Sesión");
    const formulario = document.querySelector("form");
    if (!formulario) {
      console.warn("No se encontró el formulario");
      return;
    }
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

        const user = usuarios.find((usu) => usu.usuario === usuariovalor);

        const { token } = await login(usuariovalor, contraseniavalor);

        // Guarda token y usuario en localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("usuario", JSON.stringify(user));

        alert("Usuario iniciado correctamente");


      // Redirección según rol
      if (user.rol_id === 4) {
        location.hash = `#/Admin/principal?id=${user.usuario_id}`;
      } else if (user.rol_id === 2) {
        location.hash = `#/usuario?id=${encodeURIComponent(user.usuario_id)}`;
      } else {
        alert("Rol no reconocido");
      }
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      alert("Hubo un error al iniciar sesión.");
    }
    });
    formulario.dataset.listener = "true";
};


  