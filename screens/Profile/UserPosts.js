import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { StyleSheet, View, Text, Image } from "react-native";
import { Database } from "../../config/firebase";
import {
  fetchUserPosts,
  onFetchUserPostSuccess,
  resetState
} from "./store/dispatchers";

class UserPosts extends PureComponent {
  componentDidMount() {
    this.fetchUserPosts();
  }
  // componentDidUpdate(prevProps) {
  //   const { postsFetched } = this.props;
  //   if (!postsFetched) {
  //     this.fetchUserPosts();
  //   }
  // }
  componentWillUnmount() {
    this.props.resetState();
  }
  fetchUserPosts() {
    const { fetchUserPosts, onFetchUserPostSuccess } = this.props;
    let { userId } = this.props;
    fetchUserPosts();
    Database.ref("post")
      .orderByChild("userId")
      .equalTo(userId)
      .once("value", snapshot => {
        let posts = [];
        snapshot.forEach(child => {
          posts.unshift({
            content: child.val(),
            ke: child.key
          });
        });
        onFetchUserPostSuccess(posts);
      });
  }
  render() {
    const { fetchingPosts, postsFetched, posts } = this.props;
    return (
      <View>
        {fetchingPosts
          ? <Loader />
          : <View style={styles.imagesContainer}>
              {posts.map((post, index) => {
                return (
                  <View key={index} style={styles.imageContainer}>
                    <Image
                      style={styles.image}
                      source={{
                        uri: post.content.imageUrl
                      }}
                    />
                  </View>
                );
              })}
            </View>}
        {postsFetched && posts.length === 0
          ? <View style={styles.noImageSharedContainer}>
              <Text style={styles.profileText}>Profile</Text>
              <Text style={{ marginTop: 20, width: 250, color: "#A5A5A5" }}>
                When you share photos, they'll appear on your profile
              </Text>
            </View>
          : <Text />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  profileText: {
    fontSize: 30
  },
  noImageSharedContainer: {
    marginTop: 30,
    alignItems: "center"
  },
  image: {
    height: 150
  },
  imagesContainer: {
    marginTop: 20,
    flexDirection: "row",
    flexWrap: "wrap"
  },
  imageContainer: {
    height: 150,
    width: "33.33%"
  }
});

const mapStateToProps = ({ common, profilePage }) => {
  return {
    users: common.users,
    fetchingPosts: profilePage.fetchingPosts,
    postsFetched: profilePage.postsFetched,
    posts: profilePage.posts
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchUserPosts() {
      dispatch(fetchUserPosts());
    },
    onFetchUserPostSuccess(details) {
      dispatch(onFetchUserPostSuccess(details));
    },
    resetState() {
      dispatch(resetState());
    }
  };
};

UserPosts = connect(mapStateToProps, mapDispatchToProps)(UserPosts);

export default UserPosts;
