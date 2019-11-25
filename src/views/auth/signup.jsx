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

// Config constants
import { EMAIL_REG_EXP } from "../../config";

// validation schema
const RegisterSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email!")
    .matches(EMAIL_REG_EXP, "Invalid email!")
    .required("Email field is required!"),
  password: Yup.string()
    .required("Password field is required!")
    .min(6, "mimimum 6 characters are required")
    .max(12, "maximum 12 characters are allowed"),
  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password")], "Password does not match"),
  name: Yup.string()
    .required("Name field is required!"),
  dob: Yup.string()
    .required("Date of birth field is required!")
    .test(
      "min-age-validation",
      "You must be over 12 to register",
      async function(value) {
        let minAge = new Date();
        minAge.setFullYear(minAge.getFullYear() - 12);
        return minAge.getTime() >= new Date(value).getTime();
      }
    )
});

const Signup = ({ history }) => {
  // JSS style
  const classes = useAuthStyles();

  // User context api
  const { registerUser } = useContext(UserContext);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      {/* Sign up form container */}
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        {/* Sign up form */}
        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            dob: ""
          }}
          validationSchema={RegisterSchema}
          onSubmit={async (values, action) => {
            const registered = await registerUser(values);

            if (registered) {
              action.setSubmitting(false);
              history.push("/sign-in");
            }
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
            <form className={classes.form} noValidate onSubmit={handleSubmit}>
              <Field
                margin="normal"
                fullWidth
                type="text"
                name="name"
                label="Name"
                touched={touched}
                component={InputField}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
                variant="outlined"
                autoFocus
              />
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
              />
              <Field
                margin="normal"
                fullWidth
                type="password"
                name="password"
                label="Password"
                touched={touched}
                component={InputField}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                variant="outlined"
              />
              <Field
                margin="normal"
                fullWidth
                type="password"
                name="confirmPassword"
                label="Confirm Password"
                touched={touched}
                component={InputField}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.confirmPassword}
                variant="outlined"
              />
              <Field
                margin="normal"
                fullWidth
                type="date"
                name="dob"
                label="Date of birth"
                touched={touched}
                component={InputField}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.dob}
                variant="outlined"
                inputProps={{ max: "2100-01-01" }}
                InputLabelProps={{
                  shrink: true
                }}
              />
              <Button
                disabled={isSubmitting || !isValid}
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                {isSubmitting ? "Loading ..." : "Sign Up"}
              </Button>
              <Grid container justify="center">
                <Grid item>
                  <Link
                    className={isSubmitting ? "disabled-link" : ""}
                    href="/sign-in"
                    variant="body2"
                  >
                    Already have an account? Sign in
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

export default Signup;
