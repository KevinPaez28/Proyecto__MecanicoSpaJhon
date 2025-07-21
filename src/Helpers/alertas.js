import Swal from "sweetalert2"
import "../Styles/variables.css";

export const confirm = (mensaje) => {
    return Swal.fire({
        title: "Precaución",
        text: `¿Está seguro de ${mensaje}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí"
        })
}

export const success = (data,extra ="") => {
    return Swal.fire({
        title: data.message,
        text: extra,
        icon: "success",
        draggable: true
});
}

export const confirmacion = async (mensaje = "¿Desea continuar?", extra = "") => {
  return await Swal.fire({
    title: mensaje,
    text: extra,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Si, crear",
    cancelButtonText: "No, cancelar",
    reverseButtons: true
  });
};

export const error = (mensaje = "Ocurrió un error", detalle = "") => {
  return Swal.fire({
    title: mensaje,
    text: detalle,
    icon: "error",
    confirmButtonText: "Entendido"
  });
};


export const eliminar = async (text) => {
  return Swal.fire({
    title: text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, eliminar"
  });
};

