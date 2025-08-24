import { routes } from "./routes";

// Función principal del enrutador SPA
export const router = async (elemento) => {
  const hash = location.hash.slice(2); // Eliminamos "#/"
  const segmentos = hash.split("/").filter(seg => seg); // Extrae y filtra los segmentos del hash

  // Redirigir a Home si no hay segmentos
  if (segmentos.length === 0) {
    redirigirARuta("#/Home");
    return;
  }
  // Buscar la ruta y extraer parametros
  const resultadoRuta = encontrarRuta(routes, segmentos);

  if (!resultadoRuta) {
    console.warn("Ruta inválida:", hash);
    elemento.innerHTML = `<h2>Ruta no encontrada</h2>`;
    return;
  }

  const [ruta, params] = resultadoRuta;

  // Verificar acceso privado
  if (ruta.private) {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario || (params?.id && parseInt(params.id) !== usuario.usuario_id)) {
      alert("Acceso no autorizado");
      location.hash = "#/Home";
      return;
    }
  }

  // Cargar la vista HTML y ejecutar el controlador JS
  await cargarVista(ruta, elemento,params);
  // await ruta.controller(params);
};

// Redirecciona a una ruta determinada
const redirigirARuta = (ruta) => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario) {
    alert("Acceso no autorizado");
    location.hash = "#/Home";
  }
};

export const encontrarRuta = (routes, segmentos) => {  
  let rutaActual = routes;
  let rutaEncontrada = false;
  let parametros = {};  

  if (segmentos.length === 3 && segmentos[2].includes("=")) {
    parametros = extraerParametros(segmentos[2]);
    segmentos.pop();
  }

  for (let i = 0; i < segmentos.length; i++) {
    const segmento = segmentos[i];

    if (rutaActual[segmento]) {
      rutaActual = rutaActual[segmento];
      rutaEncontrada = true;
    } else {
      rutaEncontrada = false;
      break;
    }

    // 🔥 Aquí estaba la diferencia
    if (esGrupoRutas(rutaActual)) {
      if (rutaActual["/"] && i === segmentos.length - 1) {
        rutaActual = rutaActual["/"];
        rutaEncontrada = true;
      }
    }
  }

  return rutaEncontrada ? [rutaActual, parametros] : null;
};


// Extrae un objeto clave-valor desde un string de parámetros tipo "id=1&modo=editar"
const extraerParametros = (parametros) => {
  const pares = parametros.split("&");
  const params = {};
  pares.forEach(par => {
    const [clave, valor] = par.split("=");
    params[clave] = valor;
  });
  return params;
};

// Carga una vista HTML externa dentro de un elemento
const cargarVista = async (ruta, elemento) => {
  try {
    if (ruta.private) {
      const usuario = JSON.parse(localStorage.getItem("usuario"));
      if (!usuario) {
        alert("Acceso no autorizado");
        location.hash = "#/Home";
        return;
      }
    }

    const response = await fetch(`./src/views/${ruta.path}`);
    if (!response.ok) throw new Error("Vista no encontrada");

    const contenido = await response.text();
    elemento.innerHTML = contenido;

    if (ruta.controller) {
      ruta.controller(); // El controller también se llama con params en router()
    }

  } catch (error) {
    console.error(error);
    elemento.innerHTML = `<h2>Error al cargar la vista</h2>`;
  }
};

// Verifica si un objeto representa un grupo de rutas (todas sus claves son objetos)
const esGrupoRutas = (obj) => {
  for (let key in obj) {
    if (typeof obj[key] !== 'object' || obj[key] === null) {
      return false;
    }
  }
  return true;
};
