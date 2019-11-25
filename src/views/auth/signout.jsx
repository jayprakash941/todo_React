import React, { useContext } from "react";

// React router
import { Redirect } from 'react-router-dom';

// Context
import { TodoContext } from "../../context/todos.context";
import { UserContext } from "../../context/auth.context";

const Signout = () => {
  // Context api
  const { isLoggedIn, logoutUser } = useContext(UserContext);
  const { clearData } = useContext(TodoContext);

  if(isLoggedIn) {
    clearData();
    logoutUser();
  }

  return <Redirect to="/" />; 
};

export default Signout;
