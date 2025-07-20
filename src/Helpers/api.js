export const get = async (endpoint, params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`http://localhost:8080/Proyecto_grado2/api/${endpoint}?${queryString}`)
    return await response.json();
  } catch (error) {
    console.error("Error en GET:", error);
    return null;
  }
};

export const post = async (endpoint, data) => {
    try {
    const response = await fetch(`http://localhost:8080/Proyecto_grado2/api/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return response; 
  } catch (error) {
    console.error("Error en POST:", error);
    return null; 
  }
}
export const put = async (endpoint, info) => {
  try {
    return await fetch(`http://localhost:8080/Proyecto_grado2/api/${endpoint}`,{
        method:'PUT',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(info)
    })
  } catch (error) {
    console.log(error)
  }
}

export const del=async(endpoint)=>{
  return await fetch(`http://localhost:8080/Proyecto_grado2/api/${endpoint}`,{
      method:'DELETE',
      headers:{
          'Content-Type':'application/json'
      }
  })
}

export const login = async(usuario, contrasena) => {
  try {
    const response = await fetch("http://localhost:8080/Proyecto_grado2/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ usuario, contrasena }) 
    });

    if (!response.ok) throw new Error("Login fallido");

    const data = await response.text(); 
    console.log(data)
    return data;

  } catch (error) {
    console.error("Error en login:", error);
    throw error;
  }
}
    