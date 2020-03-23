import Actions from "./actions";

export function fetchUserPosts() {
  return {
    type: Actions.FETCH_USER_POSTS
  };
}

export function onFetchUserPostSuccess(details) {
  return {
    type: Actions.ON_POST_FETCH_SUCCESS,
    details
  };
}

export function resetState() {
  return {
    type: Actions.RESET_PROFILE_STATE
  };
}

export function setFollowStatus(status) {
  return {
    type: Actions.SET_FOLLOW_STATUS,
    details: { status }
  }
}