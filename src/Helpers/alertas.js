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