import React, { createContext, useReducer } from "react";

// for api call
import axios from "axios";

// Config file
import { ROOT_API } from "../config";

// Utility functions
import { toastError, toastSuccess } from "../utils";

// Getting user data from local storage
const localStorageUser = JSON.parse(localStorage.getItem("todo_user"));

// Initial state for reducer
const initialState = {
  authLoader: false,
  isLoggedIn: localStorageUser !== null ? true : false,
  user: localStorageUser !== null ? localStorageUser : null
};

// Reducer constants
const AUTH_REDUCER_TYPE = {
  AUTH_START: "AUTH_START",
  AUTH_END: "AUTH_END",
  AUTH_SUCESS: "AUTH_SUCESS",
  AUTH_FAIL: "AUTH_FAIL",
  LOGOUT_USER: "LOGOUT_USER"
};

// Auth reducer
const reducer = (state, { type, payload }) => {
  switch (type) {
    case AUTH_REDUCER_TYPE.AUTH_START:
      return { ...state, authLoader: true };
    case AUTH_REDUCER_TYPE.AUTH_END:
      return { ...state, authLoader: false };
    case AUTH_REDUCER_TYPE.AUTH_SUCESS:
      return { ...state, user: payload, authLoader: false, isLoggedIn: true };
    case AUTH_REDUCER_TYPE.AUTH_FAIL:
      return { ...state, user: null, authLoader: false, isLoggedIn: false };
    case AUTH_REDUCER_TYPE.LOGOUT_USER:
      return { ...state, user: null, authLoader: false, isLoggedIn: false };
    default:
      return state;
  }
};

// User context
export const UserContext = createContext();

// User Context provider
export const UserContextProvider = ({ children }) => {
  // Auth state and reducer
  const [authState, dispatch] = useReducer(reducer, initialState);

  /**
   * To register user
   * @param {*} userObject - Sign up form object
   */
  const registerUser = async userObject => {
    dispatch({
      type: AUTH_REDUCER_TYPE.AUTH_START
    });

    return axios
      .post(`${ROOT_API}/user/signup`, userObject)
      .then(regResponse => {
        const message = regResponse.data.message;

        toastSuccess(message);

        dispatch({
          type: AUTH_REDUCER_TYPE.AUTH_END
        });
        return message;
      })
      .catch(err => {
        dispatch({
          type: AUTH_REDUCER_TYPE.AUTH_FAIL
        });
        toastError(
          err.response
            ? err.response.data.message
            : "Something went wrong! please try again."
        );
        return false;
      });
  };

  /**
   * For login
   * @param {*} userObject - Sign in form object
   */
  const loginUser = async userObject => {
    dispatch({
      type: AUTH_REDUCER_TYPE.AUTH_START
    });
    return axios
      .post(`${ROOT_API}/user/loging`, userObject)
      .then(loginResponse => {
        const dbUserObject = loginResponse.data.data;
        toastSuccess("Logged in sucessfully");

        const userObj = {
          _id: dbUserObject.user_id,
          name: dbUserObject.name,
          email: dbUserObject.email,
          token: dbUserObject.token
        };
        localStorage.setItem("todo_user", JSON.stringify(userObj));
        dispatch({
          type: AUTH_REDUCER_TYPE.AUTH_SUCESS,
          payload: userObj
        });

        return true;
      })
      .catch(err => {
        dispatch({
          type: AUTH_REDUCER_TYPE.AUTH_FAIL
        });

        toastError(
          err.response
            ? err.response.data.message
            : "Something went wrong! please try again."
        );
        return false;
      });
  };

  /**
   * Clear user data when this is called
   */
  const logoutUser = () => {
    localStorage.setItem("todo_user", null);
    dispatch({
      type: AUTH_REDUCER_TYPE.LOGOUT_USER
    });
    toastSuccess("Logged out sucessfully");
  };

  return (
    <UserContext.Provider
      value={{
        ...authState,
        registerUser: registerUser,
        loginUser: loginUser,
        logoutUser: logoutUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
