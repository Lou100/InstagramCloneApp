import Actions from "./actions";

const defaultState = {
  users: []
};

function reducer(state = defaultState, action) {
  switch (action.type) {
    case Actions.ON_FETCH_USERS_SUCCESS:
      return { ...state, users: [...action.details] };
    case Actions.ON_UPDATE_USER_DETAILS_SUCCESS:
      const { key, imageUrl, username, fullName, description} = action.details;
      const modifiedUsers = [...state.users].map(user => {
        if(action.details.key === user.key) {
          user.content.username = username;
          user.content.fullName = fullName;
          user.content.imageUrl = imageUrl;
          user.content.description = description;
        }
        return user;
      });

      return {...state, users: [...modifiedUsers]};
    default:
      return { ...state };
  }
}

export default reducer;
