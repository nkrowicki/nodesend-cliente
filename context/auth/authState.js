import React, { useReducer } from "react";
import authContext from "./authContext";
import authReducer from "./authReducer";
import {
  REGISTRO_EXITOSO,
  REGISTRO_ERROR,
  LIMPIAR_ALERTA,
  LOGIN_ERROR,
  LOGIN_EXITOSO,
  USUARIO_AUTENTICADO,
  CERRAR_SESION,
} from "../../types";

import clienteAxios from "../../config/axios";
import tokenAuth from "../../config/tokenAuth";
import Axios from "axios";

const authState = ({ children }) => {
  // Definir un state inicial
  const initialState = {
    token: typeof window !== "undefined" ? localStorage.getItem("token") : "",
    autenticado: null,
    usuario: null,
    mensaje: null,
  };

  // Definir el reducer
  const [state, dispatch] = useReducer(authReducer, initialState);

  const registrarUsuario = async (datos) => {
    try {
      const respuesta = await clienteAxios.post("/api/usuarios", datos);

      dispatch({
        type: REGISTRO_EXITOSO,
        payload: respuesta.data.msg,
      });
    } catch (error) {
      dispatch({
        type: REGISTRO_ERROR,
        payload: error.response.data.msg,
      });
    }

    // Limpiar alerta
    setTimeout(() => {
      dispatch({ type: LIMPIAR_ALERTA });
    }, 2000);
  };

  // AUtenticar usuarios
  const iniciarSesion = async (datos) => {
    try {
      const respuesta = await clienteAxios.post("/api/auth", datos);
      dispatch({ type: LOGIN_EXITOSO, payload: respuesta.data.token });
    } catch (error) {
      dispatch({
        type: LOGIN_ERROR,
        payload: error.response.data.msg,
      });
    }
    // Limpiar alerta
    setTimeout(() => {
      dispatch({ type: LIMPIAR_ALERTA });
    }, 2000);
  };

  // Retorne el usuario autenticado en base al JWT
  const usuarioAutenticado = async () => {
    const token = localStorage.getItem("token");
    if (token) tokenAuth(token);

    try {
      const respuesta = await clienteAxios.get("/api/auth");
      dispatch({
        type: USUARIO_AUTENTICADO,
        payload: respuesta.data.usuario,
      });
    } catch (error) {
      dispatch({
        type: REGISTRO_ERROR,
        payload: error.response.data.msg,
      });
    }
  };

  // Cerrar sesion
  const cerrarSesion = async () => {
    dispatch({
      type: CERRAR_SESION,
    });
  };

  return (
    <authContext.Provider
      value={{
        token: state.token,
        autenticado: state.autenticado,
        usuario: state.usuario,
        mensaje: state.mensaje,
        iniciarSesion,
        cerrarSesion,
        registrarUsuario,
        usuarioAutenticado,
      }}
    >
      {children}
    </authContext.Provider>
  );
};

export default authState;
