import React, { useState, useContext } from "react";

// Material UI
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

// Material UI icons
import AddIcon from "@material-ui/icons/AddCircle";

// JSS
import useHomeStyles from "./home.jss";

// Popup component
import FullPageModal from "../../components/ui/FullPageModal";

// Create todo form
import AddEditTodoForm from "./AddEditTodoForm";

// Context
import { UserContext } from "../../context/auth.context";

// Table
import TodoTable from "./TodoTable";

const Home = () => {
  // JSS style
  const classes = useHomeStyles();

  // Context api
  const Auth = useContext(UserContext);

  // Local state
  const [openTodoModal, setOpenTodoModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editTodoObj, setEditTodoObj] = useState(null);

  /**
   * To edit todo 
   * @param {*} data - todo task data
   */
  const editCurrentTodo = data => {
    setIsEdit(true);
    setEditTodoObj(data);
    setOpenTodoModal(true);
  };

  /**
   * To edit guest user todo
   * @param {*} id - todo index from table
   * @param {*} data - todo task data
   */
  const editCurrentTodoForGuest = (id, data) => {
    data.id = id
    setIsEdit(true);
    setEditTodoObj(data);
    setOpenTodoModal(true);
  };

  /**
   * Close open modal
   */
  const closeModal = _ => {
    setIsEdit(false);
    setOpenTodoModal(false);
  }

  return (
    <Container maxWidth="lg">
      <Grid container direction="column">
        {/* First section */}
        <Grid item xs={12}>
          <Button
            onClick={_ => setOpenTodoModal(true)}
            className={`${classes.btn} capitalize`}
          >
            <AddIcon color="secondary" className={classes.extendedIcon} />
            Add Todo
          </Button>
        </Grid>
        {/* Second section */}
        <Grid item xs={12}>
          {/* Todo table component */}
          <TodoTable
            editCurrentTodo={editCurrentTodo}
            editCurrentTodoForGuest={editCurrentTodoForGuest}
            user={Auth.user}
            isLoggedIn={Auth.isLoggedIn}
          />
        </Grid>
      </Grid>
      {/* Full page popup component */}
      <FullPageModal
        title={"Create Todo"}
        open={openTodoModal}
        handleClose={_ => closeModal()}
      >
        {/* Add edit form component */}
        <AddEditTodoForm
          user={Auth.user}
          isLoggedIn={Auth.isLoggedIn}
          isEditForm={isEdit}
          initValues={editTodoObj}
          handleClose={_ => closeModal()}
        />
      </FullPageModal>
    </Container>
  );
};

export default Home;
