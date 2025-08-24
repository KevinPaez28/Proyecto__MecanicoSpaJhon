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

    if (!usuario || !contrasenia) {
      alert("Faltan campos en el formulario.");
      return;
    }

    const usuariovalor = usuario.value.trim();
    const contraseniavalor = contrasenia.value.trim();

    // Validar que no estén vacíos
    if (!usuariovalor || !contraseniavalor) {
      await error("Todos los campos son obligatorios.");
      return;
    }

    try {
      const usuarios = await get("Usuarios/todos");
      const roles = await get("Roles");

      const user = usuarios.find((usu) => usu.usuario === usuariovalor);

      if (!user) {
        await error("Usuario no encontrado.");
        return;
      }

      // Verificar si el usuario está desactivado
      if (user.estado_usuario_id !== 1) {
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

      const rolUsuario = roles.find((rol) => rol.rol_id === user.rol_id);

      // Intentar login
      const result = await login(usuariovalor, contraseniavalor);

      if (!result.ok) {
        await error(result.error);
        return;
      }

      // Si login exitoso
      localStorage.setItem("token", result.token);
      localStorage.setItem("usuario", JSON.stringify(user));
      await success({ message: "Usuario iniciado correctamente" });

      const rutaRol = rolUsuario.nombre.toLowerCase();
      location.hash = `#/${rutaRol}/principal`;
    } catch (e) {
      console.error("Error en el proceso de login:", e);
      await error("Ocurrió un error inesperado al intentar iniciar sesión.");
    }
  });
};
