import React, { createContext, useReducer } from "react";

// for api call
import axios from "axios";

// Config file
import { ROOT_API } from "../config";

// Utility functions
import { toastError, toastInfo } from "../utils";

// Initial state for reducer
const initialState = {
  todoLoader: false,
  todoList: []
};

// Reducer constants
const TODO_REDUCER_TYPE = {
  TODO_START: "TODO_START",
  TODO_SUCESS: "TODO_SUCESS",
  TODO_FAIL: "TODO_FAIL"
};

// Todo reducer
const reducer = (state, { type, payload }) => {
  switch (type) {
    case TODO_REDUCER_TYPE.TODO_START:
      return { ...state, todoLoader: true };
    case TODO_REDUCER_TYPE.TODO_SUCESS:
      return { ...state, todoList: payload, todoLoader: false };
    case TODO_REDUCER_TYPE.TODO_FAIL:
      return { ...state, todoLoader: false };
    default:
      return state;
  }
};

// Todo context
export const TodoContext = createContext();

// Todo Context Provider
export const TodoContextProvider = ({ children }) => {
  // todo state and reducer
  const [todoState, dispatch] = useReducer(reducer, initialState);

  /**
   * To get todo list of logged in user
   * @param {*} userID - Logged in user ID
   * @param {*} token - Logged in user token
   */
  const getTodosList = (userID, token) => {
    dispatch({
      type: TODO_REDUCER_TYPE.TODO_START
    });
    return axios
      .get(`${ROOT_API}/task/${userID}`, {
        headers: {
          'x-auth-token': `${token}`
        }
      })
      .then(todosListRes => {
        debugger
        dispatch({
          type: TODO_REDUCER_TYPE.TODO_SUCESS,
          payload: todosListRes.data.task ? todosListRes.data.task : []
        });
      })
      .catch(err => {
        if (err && err.response && err.response.status && err.response.status === 404) {
          toastInfo(err.response.data.message);
        } else {
          toastError("Something went wrong! please try again.");
        }
        dispatch({
          type: TODO_REDUCER_TYPE.TODO_FAIL
        });
      });
  };

  /**
   * To create new todo task
   * @param {*} token - Logged in user token
   * @param {*} todoObj - Todo task object
   */
  const addTodoInList = (token,userID, todoObj) => {
    dispatch({
      type: TODO_REDUCER_TYPE.TODO_START
    });
    return axios
      .post(`${ROOT_API}/task/${userID}`, todoObj, {
        headers: {
          'x-auth-token': `${token}`
        }
      })
      .then(todoRes => {
        const newTodosList = [...todoState.todoList];
        newTodosList.push(todoRes.data.task);
        toastInfo(`"${todoRes.data.task.taskName}" added successfully`);
        dispatch({
          type: TODO_REDUCER_TYPE.TODO_SUCESS,
          payload: newTodosList
        });

        return true;
      })
      .catch(err => {
        toastError("Something went wrong! please try again.");
        dispatch({
          type: TODO_REDUCER_TYPE.TODO_FAIL
        });
        return false;
      });
  };

  /**
   * To edit selected todo task
   * @param {*} userID - Logged in user ID
   * @param {*} _id - id of selected todo task
   * @param {*} token - Logged in user token
   * @param {*} todoObj - Todo task object
   */
  const editTodoInList = (userID, _id, token, todoObj) => {
    dispatch({
      type: TODO_REDUCER_TYPE.TODO_START
    });
    return axios
      .put(`${ROOT_API}/task/${userID}/${_id}`, todoObj, {
        headers: {
          'x-auth-token': `${token}`
        }
      })
      .then(todoRes => {
        const newTodosList = [...todoState.todoList];
        const todoIndex = newTodosList.findIndex(todo => todo._id === _id);
        toastInfo(`"${todoRes.data.task.taskName}" updated successfully`);
        newTodosList[todoIndex] = todoRes.data.task;

        dispatch({
          type: TODO_REDUCER_TYPE.TODO_SUCESS,
          payload: newTodosList
        });

        return true;
      })
      .catch(err => {
        toastError("Something went wrong! please try again.");
        dispatch({
          type: TODO_REDUCER_TYPE.TODO_FAIL
        });
        return false;
      });
  };

  /**
   * To delete task
   * @param {*} userID - Logged in user ID
   * @param {*} _id - id of selected todo task
   * @param {*} taskName - name of the task
   * @param {*} token - Logged in user token
   */
  const deleteCurrentTodo = (userID, _id, taskName, token) => {
    if (window.confirm(`Are you sure you want to remove "${taskName}"`)) {
      return axios
        .delete(`${ROOT_API}/task/${userID}/${_id}`, {
          headers: {
            'x-auth-token': `${token}`
          }
        })
        .then(_ => {
          const newTodosList = [...todoState.todoList];
          const todoIndex = newTodosList.findIndex(todo => todo._id === _id);
          toastInfo(`"${newTodosList[todoIndex].taskName}" deleted successfully`);
          newTodosList.splice(todoIndex, 1);

          dispatch({
            type: TODO_REDUCER_TYPE.TODO_SUCESS,
            payload: newTodosList
          });

          return true;
        })
        .catch(err => {
          toastError("Something went wrong! please try again.");
          dispatch({
            type: TODO_REDUCER_TYPE.TODO_FAIL
          });
          return false;
        });
    }
  };

  /**
   * To clear data of current todo list
   */
  const clearData = () => {
    dispatch({
      type: TODO_REDUCER_TYPE.TODO_SUCESS,
      payload: []
    });
  };

  /**
   * To get todo list from local storage
   */
  const getTodoListForGuest = () => {
    const todoListLocalStorage = JSON.parse(
      localStorage.getItem("todo_guest_list")
    );
    const todoList = todoListLocalStorage === null ? [] : todoListLocalStorage;
    dispatch({
      type: TODO_REDUCER_TYPE.TODO_SUCESS,
      payload: todoList
    });
  };

  /**
   * Add todo in list for guest user
   * @param {*} todoObj - Todo task object
   */
  const addTodoForGuest = todoObj => {
    toastInfo(`"${todoObj.taskName}" added successfully`)
    const todoListLocalStorage = JSON.parse(
      localStorage.getItem("todo_guest_list")
    );
    const todoList = todoListLocalStorage === null ? [] : todoListLocalStorage;
    todoList.push(todoObj);
    localStorage.setItem("todo_guest_list", JSON.stringify(todoList));
    dispatch({
      type: TODO_REDUCER_TYPE.TODO_SUCESS,
      payload: todoList
    });
  };

  /**
   * To edit selected todo
   * @param {*} id - Index of selected todo task
   * @param {*} todoObj - Todo task object
   */
  const editTodoForGuest = (id, todoObj) => {
    const newTodosList = [...todoState.todoList];
    newTodosList[id] = todoObj;
    toastInfo(`"${todoObj.taskName}" updated successfully`);
    localStorage.setItem("todo_guest_list", JSON.stringify(newTodosList));
    dispatch({
      type: TODO_REDUCER_TYPE.TODO_SUCESS,
      payload: newTodosList
    });
  };

  /**
   * To delete selected todo
   * @param {*} id - Index of selected todo task
   */
  const deleteTodoForGuest = id => {
    const newTodosList = [...todoState.todoList];
    if (window.confirm(`Are you sure you want to remove "${newTodosList[id].taskName}"`)) {
      toastInfo(`"${newTodosList[id].taskName}" deleted successfully`);
      newTodosList.splice(id, 1);
      localStorage.setItem("todo_guest_list", JSON.stringify(newTodosList));
      dispatch({
        type: TODO_REDUCER_TYPE.TODO_SUCESS,
        payload: newTodosList
      });
    }
  };

  return (
    <TodoContext.Provider
      value={{
        ...todoState,
        getTodosList: getTodosList,
        addTodoInList: addTodoInList,
        editTodoInList: editTodoInList,
        deleteCurrentTodo: deleteCurrentTodo,
        clearData: clearData,
        getTodoListForGuest: getTodoListForGuest,
        addTodoForGuest: addTodoForGuest,
        editTodoForGuest: editTodoForGuest,
        deleteTodoForGuest: deleteTodoForGuest
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};
