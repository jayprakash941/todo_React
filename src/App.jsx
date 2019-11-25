import React from "react";

// Routing paths
import Routes from "./routes";

// Toast
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Material UI
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import BlueGrey from "@material-ui/core/colors/blueGrey";
import LightGreen from "@material-ui/core/colors/lightGreen";

const App = () => {
  // Custom theme
  const theme = createMuiTheme({
    palette: {
      primary: {
        light: BlueGrey[300],
        main: BlueGrey[500],
        dark: BlueGrey[700]
      },
      secondary: {
        light: LightGreen[300],
        main: LightGreen[500],
        dark: LightGreen[700]
      },
      type: "light"
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <Routes />
      <ToastContainer />
    </ThemeProvider>
  );
};

export default App;
