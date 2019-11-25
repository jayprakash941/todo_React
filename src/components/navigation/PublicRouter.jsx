import React, { useContext } from "react";

// React routing imports
import { Route, Redirect } from "react-router-dom";

// Context
import { UserContext } from "../../context/auth.context";

// Public route guard
const PublicRouter = ({ component: Component, token, ...rest }) => {
  const { isLoggedIn } = useContext(UserContext);
  
  return (
    <Route
      {...rest}
      render={props =>
        isLoggedIn ? <Redirect to="/" /> : <Component {...props} />
      }
    />
  );
};

export default PublicRouter;
