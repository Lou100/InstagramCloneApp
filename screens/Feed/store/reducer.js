import Actions from "./actions";

const defaultState = {
  fetchingPosts: false,
  posts: []
};

function reducer(state = defaultState, action) {
  let modifiedPosts = [];
  switch (action.type) {
    case Actions.FETCH_POSTS:
      return { ...state, fetchingPosts: true };
    case Actions.ON_POSTS_FETCH_SUCCESS:
      return { ...state, fetchingPosts: false, posts: [...action.details] };
    case Actions.ON_LIKE_DISLIKE_POST:
      modifiedPosts = [...state.posts].map(post => {
        if (post.key === action.details.postId) {
          post.content.liked = !post.content.liked;
          post.content.totalLikes = post.content.liked === false
            ? post.content.totalLikes - 1
            : post.content.totalLikes + 1;
        }
        return post;
      });
      return { ...state, posts: [...modifiedPosts] };
    case Actions.SET_POST_LIKE_DETAILS:
      const { liked, totalLikes } = action.details;
      const { posts } = state;
      modifiedPosts = [...posts].map(post => {
        if (post.key === action.details.postId) {
          post.content.liked = liked;
          post.content.totalLikes = totalLikes;
        }
        return post;
      });
      return { ...state, posts: [...modifiedPosts] };
    case Actions.ON_ADD_COMMENT_SUCCESS:
      const { postId, userId, message, key } = action.details;
      modifiedPosts = [...state.posts].map(post => {
        if (post.key === action.details.postId) {
          post.content.comments = post.content.comments || [];
          post.content.comments = [
            ...post.content.comments,
            {
              // newlyAddedComment is to not hide comments under View all comments
              // these comments will be shown upfront
              content: { userId, message, key, newlyAddedComment: true },
              key: postId
            }
          ];
        }
        return post;
      });
      return { ...state, posts: [...modifiedPosts] };
    case Actions.ON_DELETE_COMMENT_SUCCESS:
      modifiedPosts = [...state.posts].map(post => {
        if (post.key === action.details.postId) {
          post.content.comments = post.content.comments.filter(
            comment => comment.content.key !== action.details.commentId
          );
        }
        return post;
      });
      return { ...state, posts: [...modifiedPosts] };
    case Actions.ADD_NEW_FEED:
      modifiedPosts = [
        {
          key: action.details.postId,
          content: {
            userId: action.details.userId,
            imageUrl: action.details.imageUrl,
            liked: false,
            totalLikes: 0,
            comments: []
          }
        },
        ...state.posts
      ];
      return {...state, posts: [...modifiedPosts]};
    default:
      return { ...state };
  }
}

export default reducer;
