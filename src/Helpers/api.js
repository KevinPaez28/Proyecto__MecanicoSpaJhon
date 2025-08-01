export const get = async (endpoint, params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`http://localhost:8080/Proyecto_grado2/api/${endpoint}${queryString}`);
    const data = await response.json();

    if (!response.ok) {
      console.error("Error en GET:", data?.error || "Error desconocido");
      return null;
    }
    return data; // Devuelve el JSON como antes
  } catch (error) {
    console.error("Error en GET:", error);
    return null;
  }
};

export const post = async (endpoint, data) => {
  try {
    const response = await fetch(`http://localhost:8080/Proyecto_grado2/api/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const responseData = await response.json();

    if (!response.ok) {
      console.error("Error en POST:", responseData?.error || "Error desconocido");
      return { ok: false, data: responseData };
    }

    return { ok: true, data: responseData };
  } catch (error) {
    console.error("Error en POST:", error);
    return { ok: false, data: null };
  }
};

export const put = async (endpoint, info) => {
  try {
    const response = await fetch(`http://localhost:8080/Proyecto_grado2/api/${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(info)
    });
    const responseData = await response.json();

    if (!response.ok) {
      console.error("Error en PUT:", responseData?.error || "Error desconocido");
      return { ok: false, data: responseData };
    }

    return { ok: true, data: responseData };
  } catch (error) {
    console.error(error);
    return { ok: false, data: null };
  }
};
export const patch = async (endpoint, data) => {
  try {
    const response = await fetch(`http://localhost:8080/Proyecto_grado2/api/${endpoint}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error("Error en PATCH:", responseData?.error || "Error desconocido");
      return { ok: false, data: responseData };
    }

    return { ok: true, data: responseData };
  } catch (error) {
    console.error("Error en PATCH:", error);
    return { ok: false, data: null };
  }
};
export const del = async (endpoint) => {
  try {
    const response = await fetch(`http://localhost:8080/Proyecto_grado2/api/${endpoint}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    const responseData = await response.json();

    if (!response.ok) {
      console.error("Error en DELETE:", responseData?.error || "Error desconocido");
      return { ok: false, data: responseData };
    }

    return { ok: true, data: responseData };
  } catch (error) {
    console.error(error);
    return { ok: false, data: null };
  }
};

export const login = async (usuario, contrasena) => {
  try {
    const response = await fetch("http://localhost:8080/Proyecto_grado2/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, contrasena })
    });
    const data = await response.json();

    if (!response.ok) {
      console.error("Login fallido:", data?.error || "Error desconocido");
      return null;
    }
    return data;
  } catch (error) {
    console.error("Error en login:", error);
    return null;
  }
};