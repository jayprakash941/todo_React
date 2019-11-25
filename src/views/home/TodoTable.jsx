import React, { useContext, useRef, useEffect } from "react";

// Material UI
import IconButton from "@material-ui/core/IconButton";

// Material Icons
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

// To display table
import ReactTable from "react-table";
import "react-table/react-table.css";

// For date and time
import moment from 'moment';

// Context
import { TodoContext } from "../../context/todos.context";

const TodoTable = ({
  user,
  isLoggedIn,
  editCurrentTodo,
  editCurrentTodoForGuest
}) => {
  // Context api
  const {
    todoList,
    todoLoader,
    getTodosList,
    deleteCurrentTodo,
    getTodoListForGuest,
    deleteTodoForGuest
  } = useContext(TodoContext);

  // Table columns
  const columns = [
    {
      Header: "Task Name",
      accessor: "taskName",
      sortable: false,
    },
    {
      Header: "Priority",
      accessor: "priority",
      sortable: false,
    },
    {
      Header: "Start Date",
      accessor: "startDate",
      sortable: false,
      Cell: data => moment(data.value).format('Do MMM YYYY')
    },
    {
      Header: "End Date",
      accessor: "endDate",
      sortable: false,
      Cell: data => moment(data.value).format('Do MMM YYYY')
    },
    {
      Header: "Comments",
      accessor: "comments",
      sortable: false,
    },
    {
      Header: "Delete",
      Cell: data => {
        return (
          <IconButton
            onClick={_ =>
              isLoggedIn
                ? deleteCurrentTodo(
                    user._id,
                    data.original._id,
                    data.original.taskName,
                    user.token
                  )
                : deleteTodoForGuest(data.index)
            }
          >
            <DeleteIcon color="secondary" />
          </IconButton>
        );
      }
    },
    {
      Header: "Edit",
      Cell: data => {
        return (
          <IconButton
            onClick={_ =>
              isLoggedIn
                ? editCurrentTodo(data.original)
                : editCurrentTodoForGuest(data.index, data.original)
            }
          >
            <EditIcon color="secondary" />
          </IconButton>
        );
      }
    }
  ];

  // Used ref to create comonentDidMount Effect
  const isMounted = useRef(true);

  useEffect(() => {
    // Used ref to create comonentDidMount Effect
    if (isMounted.current) {
      // Checking for it is guest user or logged in user
      if (isLoggedIn) {
        getTodosList(user ? user._id : "", user ? user.token : "");
      } else {
        getTodoListForGuest();
      }
      isMounted.current = false;
    }
  }, [user, getTodosList, isLoggedIn, getTodoListForGuest]);

  return (
    <ReactTable
      data={todoList}
      loading={todoLoader}
      columns={columns}
      defaultPageSize={10}
      className="mb-15"
      noDataText="No Todo found"
    />
  );
};

export default TodoTable;
