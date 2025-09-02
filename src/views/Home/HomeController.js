import { error, success, confirmUsuario } from "../../Helpers/alertas.js";
import { get, login, put } from "../../Helpers/api.js";
import { limpiar, validarFormularioCompleto } from "../../Helpers/Modules/modules.js";
import "../../Styles/Home.css";

export default (parametros = null) => {
  const formulario = document.querySelector("#formulario");

  formulario.addEventListener("submit", async (event) => {
    event.preventDefault();
    limpiar(formulario);
    validarFormularioCompleto(formulario);

    const usuario = document.getElementById("usuario");
    const contrasenia = document.getElementById("contrasenia");

    const usuariovalor = usuario.value.trim();
    const contraseniavalor = contrasenia.value.trim();

    // Validar que no estén vacíos
    if (!usuariovalor || !contraseniavalor) {
      await error("Todos los campos son obligatorios.");
      return;
    }

    try {
      const usuarios = await get("Usuarios");
      const roles = await get("Roles");
      const user = usuarios.data.find((usu) => usu.usuario == usuariovalor);
      if (!user) {
        await error("Usuario no encontrado.");
        return;
      }

      // Verificar si el usuario está desactivado
      if (user.id_estado !== 1) {
        const confirmacion = await confirmUsuario("Su usuario está desactivado. ¿Desea reactivarlo?");
        if (confirmacion) {
          const { ok, data } = await put(`Usuarios/activar/${user.usuario_id}`, {});
          if (ok) {
            await success({ message: "Usuario reactivado correctamente. Ahora puede iniciar sesión." });
          } else {
            await error(data?.error || "Error al reactivar el usuario");
          }
        }
        return; // Detener el proceso de login hasta que el usuario intente nuevamente
      }

      const rolUsuario = roles.data.find((rol) => rol.rol_id === user.rol_id);

      // --- Aquí la corrección ---
      let result; 
      try {
        result = await login(usuariovalor, contraseniavalor);
        console.log(result.message);

        if (!result.ok) {
          throw new Error(result.message);
        }

        console.log("Login exitoso:", result);

      } catch (err) {
        console.error("Error en login:", err.message);
        await error(err.message || "Credenciales incorrectas.");
        return; // Detener flujo si login falla
      }
      // ---------------------------

      const Permisos = await get(`Permisos/${rolUsuario.rol_id}`);
      console.log(Permisos.data);

      // Si login exitoso
      localStorage.setItem("token", result.data.accessToken);
      localStorage.setItem("tokenrefresh", result.data.refreshToken);
      localStorage.setItem("usuario", JSON.stringify(user));
      localStorage.setItem("permisos", JSON.stringify(Permisos.data));
      await success({ message: "Usuario iniciado correctamente" });

      const rutaRol = rolUsuario.nombre_rol.toLowerCase();
      location.hash = `#/${rutaRol}/principal`;
    } catch (e) {
      console.error("Error en el proceso de login:", e);
      await error("Ocurrió un error inesperado al intentar iniciar sesión.");
    }
  });
};
