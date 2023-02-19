const initialState = {
  user: {},
};

const userReducer = (state = initialState, action) => {
  const getUser = JSON.parse(localStorage.getItem("user"));
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        state: { user: getUser ? action.payload : getUser },
      };
    case "LOGIN_ERROR":
      return state;

    default:
      return state;
  }
};

export default userReducer;
