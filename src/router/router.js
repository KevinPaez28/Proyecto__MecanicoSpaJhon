import { routes } from "./routes";

// Función principal del enrutador SPA
export const router = async (elemento) => {
  const hash = location.hash.slice(2); // Eliminamos "#/"
  const segmentos = hash.split("/").filter(seg => seg); // Extrae y filtra los segmentos del hash

  // Redirigir a Home si no hay segmentos
  if (segmentos.length === 0) {
    redirigirARuta("Home");
    return;
  }

  console.log("Hash detectado:", hash);
  console.log("Segmentos:", segmentos);

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

const encontrarRuta = (routes, segmentos) => {
  let rutaActual = routes;
  let rutaEncontrada = false;
  let parametros = {};

 const ultimo = segmentos[segmentos.length - 1];

  // Verificamos si ese segmento contiene un signo de pregunta "?", lo que indica que hay parámetros
  if (ultimo.includes("?")) {
    
    // Dividimos ese segmento en dos partes: antes del "?" y después del "?"
    const partes = ultimo.split("?");

    // La primera parte será el nombre limpio del segmento (por ejemplo: "principal")
    const segmentoSinParametros = partes[0];

    // La segunda parte son los parámetros (por ejemplo: "id=1&modo=editar")
    const cadenaParametros = partes[1];

    // Reemplazamos en el array el segmento original por el nombre limpio (sin los parámetros)
    segmentos[segmentos.length - 1] = segmentoSinParametros;

    // Convertimos la cadena de parámetros en un objeto clave-valor (por ejemplo: { id: "1", modo: "editar" })
    parametros = extraerParametros(cadenaParametros);
  }
  // Recorremos los segmentos del hash para encontrar la ruta correspondiente
  segmentos.forEach(segmento => {
    if (rutaActual[segmento]) {
      rutaActual = rutaActual[segmento];
      rutaEncontrada = true;
    } else {
      rutaEncontrada = false;
    }

    // Si la ruta actual es un grupo de rutas
    if (esGrupoRutas(rutaActual)) {
      if (rutaActual["/"] && segmentos.length == 1) {
        rutaActual = rutaActual["/"];
        rutaEncontrada = true;
      } else {
        rutaEncontrada = false;
      }
    }
  });

  if (rutaEncontrada) {
    return [rutaActual, parametros];
  } else {
    return null;
  }
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
