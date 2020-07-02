import { serializeError } from "serialize-error";

const INIT_STATE = {
  loggedUser: { anonymous: true },
  authError: null,
  authErrorDetails: null,
};

const authReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    //> LOGIN
    case "LOGIN_SUCCESS":
      return {
        ...state,
        loggedUser: { ...action.payload, anonymous: false },
        authErrorDetails: null,
      };

    case "LOGIN_ANON_SUCCESS":
      return {
        ...state,
        loggedUser: undefined,
        loggedUser: { anonymous: true },
        authErrorDetails: null,
      };

    case "LOGIN_FAILED" || "LOGIN_ERROR":
      return {
        ...state,
        authError: action.payload,
        authErrorDetails: serializeError(action.payload.error),
      };

    //> LOGOUT
    case "LOGOUT_SUCCESS":
      return INIT_STATE;

    case "LOGOUT_FAILED" || "LOGIN_ERROR":
      return {
        ...state,
        authError: action.payload,
        authErrorDetails: serializeError(action.payload.error),
      };

    default:
      return state;
  }
};

export default authReducer;