import Actions from "./actions";

export function fetchPosts() {
  return {
    type: Actions.FETCH_POSTS
  };
}

export function onPostFetchSuccess(details) {
  return {
    type: Actions.ON_POSTS_FETCH_SUCCESS,
    details
  };
}

export function onLikeDislikePost(postId) {
  return {
    type: Actions.ON_LIKE_DISLIKE_POST,
    details: { postId }
  };
}

export function setPostLikeDetails(details) {
  return {
    type: Actions.SET_POST_LIKE_DETAILS,
    details
  };
}

export function onAddCommentSuccess(details) {
  return {
    type: Actions.ON_ADD_COMMENT_SUCCESS,
    details
  };
}

export function onDeleteCommentSuccess(details) {
  return {
    type: Actions.ON_DELETE_COMMENT_SUCCESS,
    details
  };
}

export function addNewFeed(details) {
  return {
    type: Actions.ADD_NEW_FEED,
    details
  };
}