import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { FlatList } from "react-native";
import { Database } from "../../config/firebase";
import Loader from "../../components/Loader";
import { fetchPosts, onPostFetchSuccess } from "./store/dispatchers";
import Post from "./Post";

class PostFeed extends PureComponent {
  componentDidMount() {
    const { fetchPosts, onPostFetchSuccess } = this.props;
    fetchPosts();
    Database.ref("post").once("value", snapshot => {
      let posts = [];
      snapshot.forEach(child => {
        const content = child.val();
        const comments = [];
        for (const key in content.comments) {
          comments.push({ content: { ...content.comments[key], key } });
        }
        content.comments = [...comments];
        let totalLikes = 0;
        for (const key in content.likes) {
          totalLikes += 1;
        }
        content.totalLikes = totalLikes;
        posts.unshift({
          content,
          key: child.key
        });
      });
      onPostFetchSuccess(posts);
    });
  }
  render() {
    const { fetchingPosts, feeds, navigation } = this.props;
    return fetchingPosts
      ? <Loader />
      : <FlatList
          keyboardShouldPersistTaps={"included"}
          data={feeds}
          keyExtractor={(feed, index) => index}
          renderItem={({ item: feed }) =>
            <Post
              navigation={navigation}
              feed={feed}
            />}
        />;
  }
}

const mapStateToProps = ({ feedPage }) => {
  return {
    fetchingPosts: feedPage.fetchPosts,
    feeds: feedPage.posts
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchPosts() {
      dispatch(fetchPosts());
    },
    onPostFetchSuccess(details) {
      dispatch(onPostFetchSuccess(details));
    }
  };
};

PostFeed = connect(mapStateToProps, mapDispatchToProps)(PostFeed);

export default PostFeed;
