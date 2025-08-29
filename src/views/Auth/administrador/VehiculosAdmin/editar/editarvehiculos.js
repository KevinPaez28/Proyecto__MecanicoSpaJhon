import { get, put } from "../../../../../Helpers/api";
import { confirm, success, error } from "../../../../../Helpers/alertas.js";


export default async (parametros = null) => {
    const idvehiculo = localStorage.getItem("idvehiculo");
    const Vehiculos = async (vehiculos, id) => {

        const seccionInfo = document.querySelector(".interfazVehiculos__content");
        const Usuarios = await get(`usuarios`);
        const cards = document.createElement("div");
        cards.classList.add("interfazvehiculos__cards");

        const body = document.createElement("div");
        body.classList.add("interfazvehiculos__body");

        const infoWrapper = document.createElement("div");
        infoWrapper.classList.add("interfazvehiculos__info");

        // Titulos
        const titulos = document.createElement("div");
        titulos.classList.add("interfazvehiculos__contentCards");

        const labelMarca = document.createElement("label");
        labelMarca.textContent = "Marca:";
        titulos.appendChild(labelMarca);

        const labelPlaca = document.createElement("label");
        labelPlaca.textContent = "Placa:";
        titulos.appendChild(labelPlaca);

        const labelModelo = document.createElement("label");
        labelModelo.textContent = "Modelo:";
        titulos.appendChild(labelModelo);

        const labelUsuario = document.createElement("label");
        labelUsuario.textContent = "Propietario:";
        titulos.appendChild(labelUsuario);

        // Inputs
        const content = document.createElement("div");
        content.classList.add("interfazvehiculos__contentCard");

        const inputMarca = document.createElement("input");
        inputMarca.classList.add("inputEditar");
        inputMarca.value = vehiculos.data.marca;
        inputMarca.type = "text";
        content.appendChild(inputMarca);

        const inputPlaca = document.createElement("input");
        inputPlaca.classList.add("inputEditar");
        inputPlaca.value = vehiculos.data.placa;
        inputPlaca.type = "text";
        content.appendChild(inputPlaca);

        const inputModelo = document.createElement("input");
        inputModelo.classList.add("inputEditar");
        inputModelo.value = vehiculos.data.modelo;
        inputModelo.type = "text";
        content.appendChild(inputModelo);

        const inputUsuario = document.createElement("input");
        inputUsuario.classList.add("inputEditar");
        const usuariosFiltrados = Usuarios.data.filter((usuario) => {
            const mismoUsuario = Number(usuario.usuario_id) === Number(vehiculos.data.usuario_id);
            const esRolCliente = Number(usuario.rol_id) === 2;
            return mismoUsuario && esRolCliente;
        });
        if (usuariosFiltrados.length > 0) {
            inputUsuario.value = usuariosFiltrados[0].nombre;
        } else {
            inputUsuario.value = "Sin usuario asignado";
        }
        inputUsuario.type = "text";
        content.appendChild(inputUsuario);

        // Botones
        const botones = document.createElement("div");
        botones.classList.add("interfazvehiculos__button");

        const btnGuardar = document.createElement("button");
        btnGuardar.classList.add("interfazvehiculos__buttones");
        btnGuardar.textContent = "Guardar";

        botones.appendChild(btnGuardar);


        btnGuardar.addEventListener("click", async () => {
            const datosActualizados = {
                marca: inputMarca.value,
                placa: inputPlaca.value,
                modelo: inputModelo.value,
            };
            try {
                const confirmacion = await confirm("¿Desea actualizar este vehiculo?");
                if (confirmacion.isConfirmed) {
                    const respuesta = await put(`vehiculos/${id}`, datosActualizados);

                    if (respuesta.ok) {
                        if ((await success({ message: "Vehiculo actualizado con éxito" })).isConfirmed) {
                            window.history.back();
                        }
                    } else {
                        // Mostrar errores de validación si existen
                        if (respuesta.errors.length > 0) {
                            let mensajes = respuesta.errors.map(e => `${e.message}`).join("\n");
                            await error("Errores de validación", mensajes);
                        } else {
                            await error("Error al actualizar usuario", respuesta.message || "Error desconocido");
                        }
                    }
                }
            } catch (err) {
                console.error("Error:", err);
            }
        });

        // Estructura final del card
        infoWrapper.appendChild(titulos);
        infoWrapper.appendChild(content);
        body.appendChild(infoWrapper);
        body.appendChild(botones);
        cards.appendChild(body);
        seccionInfo.appendChild(cards);
    };
    const vehiculos = await get(`Vehiculos/${idvehiculo}`);

    Vehiculos(vehiculos, idvehiculo,);

}


