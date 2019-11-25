import React, { useContext } from "react";

// React router
import { Link, NavLink } from "react-router-dom";

// Context
import { UserContext } from "../../context/auth.context";

// Material UI
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Avatar from "@material-ui/core/Avatar";

const Header = () => {
  const { user, isLoggedIn } = useContext(UserContext);
    return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar>
          <Typography className="flex-1" variant="h6">
            <Link className="decoration-none" to="/">Todo App</Link>
          </Typography>
          {isLoggedIn ? (
            <>
              <Avatar color="primary">{user.email.charAt(0).toUpperCase()}</Avatar>
              <Button color="inherit" to="/sign-out" component={NavLink} className="capitalize">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={NavLink} to="/sign-in" className="capitalize">
                Sign in
              </Button>
              <Button color="inherit" component={NavLink} to="/sign-up" className="capitalize">
                Sign up
              </Button>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
