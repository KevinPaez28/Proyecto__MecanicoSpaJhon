import { get } from "../../../../Helpers/api.js";
import { tienePermiso } from "../../../../Helpers/Modules/modules";
import "../../../../Styles/Administrador/factura.css";

export default () => {
  const generarFacturasAdmin = async () => {
    const facturas = await get(`facturas/usuario`)
    const seccionfactura = document.querySelector(".facturasAdmin")
    facturas.data.forEach((element) => {
      const card = document.createElement("div");
      card.classList.add("facturasAdmincontent");

      const infoWrapper = document.createElement("div");
      infoWrapper.classList.add("interfazfacturas__infoadmin");

      // ---- Títulos ----
      const titulos = document.createElement("div");
      titulos.classList.add("interfazfacturas__contentCards");

      const pFactura = document.createElement("p");
      pFactura.classList.add("interfazfacturas__titulonombre");
      pFactura.textContent = "Factura N°:";
      titulos.appendChild(pFactura);

      const pEmpresa = document.createElement("p");
      pEmpresa.classList.add("interfazfacturas__titulonombre");
      pEmpresa.textContent = "Empresa:";
      titulos.appendChild(pEmpresa);

      const pNIT = document.createElement("p");
      pNIT.classList.add("interfazfacturas__titulonombre");
      pNIT.textContent = "NIT:";
      titulos.appendChild(pNIT);

      const pDireccion = document.createElement("p");
      pDireccion.classList.add("interfazfacturas__titulonombre");
      pDireccion.textContent = "Dirección:";
      titulos.appendChild(pDireccion);

      const pCorreo = document.createElement("p");
      pCorreo.classList.add("interfazfacturas__titulonombre");
      pCorreo.textContent = "Correo:";
      titulos.appendChild(pCorreo);

      const pRepresentante = document.createElement("p");
      pRepresentante.classList.add("interfazfacturas__titulonombre");
      pRepresentante.textContent = "Representante:";
      titulos.appendChild(pRepresentante);

      const placa = document.createElement("p");
      placa.classList.add("interfazfacturas__titulonombre");
      placa.textContent = "Placa:";
      titulos.appendChild(placa);

      const pFecha = document.createElement("p");
      pFecha.classList.add("interfazfacturas__titulonombre");
      pFecha.textContent = "Fecha:";
      titulos.appendChild(pFecha);


      const pTotal = document.createElement("p");
      pTotal.classList.add("interfazfacturas__titulonombre");
      pTotal.textContent = "Total:";
      titulos.appendChild(pTotal);

      // NUEVOS CAMPOS
      const pNombre = document.createElement("p");
      pNombre.classList.add("interfazfacturas__titulonombre");
      pNombre.textContent = "Nombre del cliente:";
      titulos.appendChild(pNombre);


      // ---- Contenido ----
      const content = document.createElement("div");
      content.classList.add("interfazfacturas__contentCard");

      const facturaId = document.createElement("p");
      facturaId.classList.add("interfazfacturas__datos");
      facturaId.textContent = element.factura_id;

      const empresa = document.createElement("p");
      empresa.classList.add("interfazfacturas__datos");
      empresa.textContent = element.empresa;

      const nit = document.createElement("p");
      nit.classList.add("interfazfacturas__datos");
      nit.textContent = element.nit;

      const placas = document.createElement("p");
      placas.classList.add("interfazfacturas__datos");
      placas.textContent = element.placa;

      const direccion = document.createElement("p");
      direccion.classList.add("interfazfacturas__datos");
      direccion.textContent = element.direccion || "Sin dirección";

      const correo = document.createElement("p");
      correo.classList.add("interfazfacturas__datos");
      correo.textContent = element.correo || "Sin correo";

      const representante = document.createElement("p");
      representante.classList.add("interfazfacturas__datos");
      representante.textContent = element.representante_legal || "Sin representante";

      const fecha = document.createElement("p");
      fecha.classList.add("interfazfacturas__datos");
      fecha.textContent = `${element.fecha_emision[2]}/${element.fecha_emision[1]}/${element.fecha_emision[0]}`;



      const total = document.createElement("p");
      total.classList.add("interfazfacturas__datos");
      total.textContent = `$${parseInt(element.total).toLocaleString('es-CO')}`;

      // NUEVOS CAMPOS
      const nombre = document.createElement("p");
      nombre.classList.add("interfazfacturas__datos");
      nombre.textContent = element.cliente || "Sin cliente";

      content.appendChild(facturaId);
      content.appendChild(empresa);
      content.appendChild(nit);
      content.appendChild(direccion);
      content.appendChild(correo);
      content.appendChild(representante);
      content.appendChild(placas);
      content.appendChild(fecha);
      content.appendChild(total);
      content.appendChild(nombre);

      // ---- Armamos la card ----
      infoWrapper.appendChild(titulos);
      infoWrapper.appendChild(content);
      card.appendChild(infoWrapper);
      seccionfactura.appendChild(card);
    })
  }
  if (tienePermiso("Facturas_Listar")) {
    generarFacturasAdmin()
  }
}