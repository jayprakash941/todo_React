import React, { useContext } from "react";

// Form
import { Formik, Field } from "formik";
import * as Yup from "yup"; // For form validation

// UI components
import InputField from "../../components/ui/form/InputField";

// Material ui
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";

// Material ui icons
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { Link } from "@material-ui/core";

// JSS
import { useAuthStyles } from "./auth.jss";

// Context
import { UserContext } from "../../context/auth.context";
import { TodoContext } from "../../context/todos.context";

// Config constants
import { EMAIL_REG_EXP } from "../../config";

// validation schema
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email!")
    .matches(EMAIL_REG_EXP, "Invalid email!")
    .required("The Email field is required!"),
  password: Yup.string().required("The Password field is required!  ")
});

const Signin = () => {
  // JSS style
  const classes = useAuthStyles();

  // Context api
  const { loginUser } = useContext(UserContext);
  const { clearData } = useContext(TodoContext);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      {/* Sign in form container */}
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        {/* Sign in form */}
        <Formik
          initialValues={{
            email: "",
            password: ""
          }}
          validationSchema={LoginSchema}
          onSubmit={async (values, action) => {
            const loggedIn = await loginUser(values);
            if (loggedIn) {
              clearData()
            }
            action.setSubmitting(false);
          }}
        >
          {({
            isValid,
            isSubmitting,
            handleSubmit,
            values,
            touched,
            handleChange,
            handleBlur
          }) => (
            <form className={classes.form} onSubmit={handleSubmit} noValidate>
              <Field
                margin="normal"
                fullWidth
                type="email"
                name="email"
                label="Email"
                touched={touched}
                component={InputField}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                variant="outlined"
                autoFocus
              />
              <Field
                margin="normal"
                fullWidth
                type="password"
                name="password"
                label="Password"
                touched={touched}
                component={InputField}
                onBlur={handleBlur}
                value={values.password}
                variant="outlined"
              />
              <Button
                disabled={isSubmitting || !isValid}
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                {isSubmitting ? "Loading ..." : "Sign In"}
              </Button>
              <Grid container justify="center">
                <Grid item>
                  <Link
                    href="/sign-up"
                    variant="body2"
                    className={isSubmitting ? "disabled-link" : ""}
                  >
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      </div>
    </Container>
  );
};

export default Signin;
