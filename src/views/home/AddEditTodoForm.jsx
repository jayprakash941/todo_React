import React, { useContext } from "react";

// Form
import { Formik, Field } from "formik";
import * as Yup from "yup"; // For form validation

// UI components
import InputField from "../../components/ui/form/InputField";
import SelectField from "../../components/ui/form/SelectField";

// Material UI
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

// Context
import { TodoContext } from "../../context/todos.context";

// validation schema
const AddEditSchema = Yup.object().shape({
  taskName: Yup.string()
    .required("The task name field is required"),
  priority: Yup.string().required("The priority field is required"),
  startDate: Yup.string().required("The start date field is required"),
  endDate: Yup.string()
    .required("The end date field is required")
    .test(
      "start-end-date-validation",
      "End date should be after or on start date.",
      async function(value) {
        if (this.parent.startDate) {
          return (
            new Date(this.parent.startDate).getTime() <=
            new Date(value).getTime()
          );
        }
        return false;
      }
    ),
  comments: Yup.string().required("The comments field is required")
});

// Priority options
const PRIORITY_OPTIONS = [
  {
    value: "low",
    name: "Low"
  },
  {
    value: "medium",
    name: "Medium"
  },
  {
    value: "high",
    name: "High"
  }
];

const AddEditTodoForm = ({
  isLoggedIn,
  user,
  initValues,
  isEditForm,
  handleClose
}) => {
  const {
    addTodoInList,
    editTodoInList,
    addTodoForGuest,
    editTodoForGuest
  } = useContext(TodoContext);

  return (
    <Grid container justify="center" alignItems="center">
      <Grid item xs={12}>
        <Formik
          initialValues={{
            userID: isLoggedIn ? user._id : "guest",
            taskName: isEditForm ? initValues.taskName : "",
            priority: isEditForm ? initValues.priority : "",
            startDate: isEditForm ? initValues.startDate : "",
            endDate: isEditForm ? initValues.endDate : "",
            comments: isEditForm ? initValues.comments : ""
          }}
          validationSchema={AddEditSchema}
          onSubmit={async (values, action) => {
            if (isLoggedIn) {
              if (isEditForm) {
                const editted = await editTodoInList(
                  user ? user._id : "",
                  initValues._id,
                  user ? user.token : "",
                  values
                );

                if (editted) {
                  handleClose();
                }
              } else {
                const added = await addTodoInList(
                  user ? user.token : "",
                  user?user._id:"",
                  values
                );

                if (added) {
                  handleClose();
                }
              }
            } else {
              if (isEditForm) {
                editTodoForGuest(initValues.id, values);
              } else {
                addTodoForGuest(values);
              }
              handleClose();
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
            <form onSubmit={handleSubmit} noValidate>
              <Field
                margin="normal"
                fullWidth
                type="string"
                name="taskName"
                label="Task Name"
                touched={touched}
                component={InputField}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.taskName}
                variant="outlined"
                autoFocus
              />

              <Field
                margin="normal"
                fullWidth
                name="priority"
                label="Priority"
                touched={touched}
                component={SelectField}
                onChange={handleChange}
                onBlur={handleBlur}
                defaultValue={values.priority}
                variant="outlined"
                option_list={PRIORITY_OPTIONS}
              />

              <Field
                margin="normal"
                fullWidth
                type="date"
                name="startDate"
                label="Start Date"
                touched={touched}
                component={InputField}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.startDate}
                variant="outlined"
                inputProps={{ max: "2100-01-01" }}
                InputLabelProps={{
                  shrink: true
                }}
              />

              <Field
                margin="normal"
                fullWidth
                type="date"
                name="endDate"
                label="End Date"
                touched={touched}
                component={InputField}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.endDate}
                variant="outlined"
                inputProps={{ min: values.startDate, max: "2100-01-01" }}
                disabled={!values.startDate}
                InputLabelProps={{
                  shrink: true
                }}
              />

              <Field
                margin="normal"
                fullWidth
                type="string"
                name="comments"
                label="Comments"
                touched={touched}
                component={InputField}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.comments}
                variant="outlined"
              />

              <Button
                disabled={isSubmitting || !isValid}
                type="submit"
                variant="contained"
                color="primary"
                className="m-15"
              >
                {isSubmitting ? "Loading ..." : "Submit"}
              </Button>
            </form>
          )}
        </Formik>
      </Grid>
    </Grid>
  );
};

export default AddEditTodoForm;
