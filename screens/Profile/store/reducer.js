import Actions from "./actions";

const defaultState = {
  fetchingPosts: false,
  postsFetched: false,
  isFollowing: false,
  posts: []
};

function reducer(state = defaultState, action) {
  switch (action.type) {
    case Actions.FETCH_USER_POSTS:
      return { ...state, fetchingePosts: true };
    case Actions.ON_POST_FETCH_SUCCESS:
      return {
        ...state,
        fetchingPosts: false,
        postsFetched: true,
        posts: [...action.details]
      };
    case Actions.RESET_PROFILE_STATE:
      return {...defaultState};
    case Actions.SET_FOLLOW_STATUS:
      return {...state, isFollowing: action.details.status};
    default:
      return { ...state };
  }
}

export default reducer;
