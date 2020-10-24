import React, { useReducer } from "react";
import appContext from "./appContext";
import appReducer from "./appReducer";
import {
  MOSTRAR_ALERTA,
  OCULTAR_ALERTA,
  SUBIR_ARCHIVO,
  SUBIR_ARCHIVO_EXITO,
  SUBIR_ARCHIVO_ERROR,
  CREAR_ENLACE_EXITO,
  CREAR_ENLACE_ERROR,
  LIMPIAR_STATE,
} from "../../types";
import clienteAxios from "../../config/axios";

const AppState = ({ children }) => {
  const initialState = {
    mensaje_archivo: "",
    nombre: "",
    nombre_original: "",
    cargando: null,
    descargas: 1,
    password: 1,
    autor: null,
    url: "",
  };

  // Crear dispatch y state
  const [state, dispatch] = useReducer(appReducer, initialState);

  const mostrarAlerta = (msg) => {
    dispatch({
      type: MOSTRAR_ALERTA,
      payload: msg,
    });

    setTimeout(() => {
      dispatch({ type: OCULTAR_ALERTA });
    }, 2000);
  };

  const subirArchivo = async (formData, nombreArchivo) => {
    dispatch({
      type: SUBIR_ARCHIVO,
    });

    try {
      const resultado = await clienteAxios.post("/api/archivos", formData);
      console.log("resultado.data", resultado.data);

      dispatch({
        type: SUBIR_ARCHIVO_EXITO,
        payload: {
          nombre: resultado.data.archivo,
          nombre_original: nombreArchivo,
        },
      });
    } catch (error) {
      dispatch({
        type: SUBIR_ARCHIVO_ERROR,
        payload: error.response.data.msg,
      });
    }
  };

  const limpiarState = () => {
    dispatch({
      type: LIMPIAR_STATE,
    });
  };
  
  const crearEnlace = async () => {
    const data = {
      nombre: state.nombre,
      nombre_original: state.nombre_original,
      descargas: state.descargas,
      password: state.password,
      autor: state.autor,
    };

    try {
      const resultado = await clienteAxios.post("/api/enlaces", data);
      console.log("resultado.data", resultado.data);
      dispatch({
        type: CREAR_ENLACE_EXITO,
        payload: resultado.data.msg,
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <appContext.Provider
      value={{
        autor: state.autor,
        cargando: state.cargando,
        descargas: state.descargas,
        mensaje_archivo: state.mensaje_archivo,
        nombre: state.nombre,
        nombre_original: state.nombre_original,
        password: state.password,
        url: state.url,
        crearEnlace,
        mostrarAlerta,
        limpiarState,
        subirArchivo,
      }}
    >
      {children}
    </appContext.Provider>
  );
};

export default AppState;
