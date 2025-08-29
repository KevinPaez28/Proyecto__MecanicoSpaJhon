import { jwtDecode } from "jwt-decode";
import { redirigirARuta } from "../router/router.js";
/* ----------------- Manejo de Tokens ----------------- */
export function isTokenExpired(token) {
  try {
    const { exp } = jwtDecode(token);
    return Date.now() >= exp * 1000;
  } catch {
    return true; // si no se puede decodificar, lo consideramos inválido
  }
}

export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("tokenrefresh");
  if (!refreshToken) return null;

  try {
    const res = await fetch("http://localhost:3000/api/Usuarios/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken })
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("token",  data.data.accessToken); // guarda el nuevo access token
      return data.data.accessToken;
    } else {
      localStorage.clear();
      redirigirARuta("#/Home");
      return null;
    }
  } catch (err) {
    console.error("Error al refrescar token:", err);
    localStorage.clear();
    redirigirARuta("#/Home");
    return null;
  }
}

export async function getAuthHeaders() {
  let token = localStorage.getItem("token");
  if (!token || isTokenExpired(token)) {
    token = await refreshAccessToken();
  }
  return token
    ? { "Content-Type": "application/json", Authorization: "Bearer " + token }
    : { "Content-Type": "application/json" };
}

/* ----------------- Peticiones con headers ----------------- */
export const get = async (endpoint, params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`http://localhost:3000/api/${endpoint}${queryString}`, {
      headers: await getAuthHeaders()
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("Error en GET:", data?.error || "Error desconocido");
      return null;
    }
    return data;
  } catch (error) {
    console.error("Error en GET:", error);
    return null;
  }
};

export const post = async (endpoint, data) => {
  try {
    const response = await fetch(`http://localhost:3000/api/${endpoint}`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify(data)
    });
    const responseData = await response.json();

    return {
      ok: response.ok,
      message: responseData.message || "",
      errors: responseData.erros || [],
      data: responseData.data || null
    };

  } catch (error) {
    console.error("Error en POST:", error);
    return { ok: false, message: "Error inesperado", errors: [], data: null };
  }
};

export const put = async (endpoint, info) => {
  try {
    const response = await fetch(`http://localhost:3000/api/${endpoint}`, {
      method: 'PUT',
      headers: await getAuthHeaders(),
      body: JSON.stringify(info)
    });
    const responseData = await response.json();

    return {
      ok: response.ok,
      message: responseData.message || "",
      errors: responseData.erros || [],
      data: responseData.data || null
    };

  } catch (error) {
    console.error("Error en PUT:", error);
    return { ok: false, message: "Error inesperado", errors: [], data: null };
  }
};

export const patch = async (endpoint, data) => {
  try {
    const response = await fetch(`http://localhost:3000/api/${endpoint}`, {
      method: 'PATCH',
      headers: await getAuthHeaders(),
      body: JSON.stringify(data)
    });
    const responseData = await response.json();

    return {
      ok: response.ok,
      message: responseData.message || "",
      errors: responseData.erros || [],
      data: responseData.data || null
    };

  } catch (error) {
    console.error("Error en PATCH:", error);
    return { ok: false, message: "Error inesperado", errors: [], data: null };
  }
};

export const del = async (endpoint) => {
  try {
    const response = await fetch(`http://localhost:3000/api/${endpoint}`, {
      method: 'DELETE',
      headers: await getAuthHeaders()
    });
    const responseData = await response.json();

    return {
      ok: response.ok,
      message: responseData.message || "",
      errors: responseData.erros || [],
      data: responseData.data || null
    };

  } catch (error) {
    console.error("Error en DELETE:", error);
    return { ok: false, message: "Error inesperado", errors: [], data: null };
  }
};

export const login = async (usuario, contrasena) => {
  try {
    const response = await fetch("http://localhost:3000/api/Usuarios/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, contrasena })
    });

    const data = await response.json();
    return {
      ok: response.ok,
      message: data.message || "",
      errors: data.erros || [],
      data: data.data || null,
      token: data.token || null
    };

  } catch (error) {
    console.error("Error en login:", error);
    return { ok: false, message: "Error inesperado al iniciar sesión", errors: [], data: null, token: null };
  }
};
