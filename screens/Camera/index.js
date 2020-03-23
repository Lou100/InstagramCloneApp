import React, { PureComponent } from "react";
import { connect } from "react-redux";
import Camera from "../../components/Camera";
import Firebase, { Database } from "../../config/firebase";
import { createPost, onCreatePostSuccess } from "./store/dispatchers";
import { addNewFeed } from "../Feed/store/dispatchers";
import Loader from "../../components/Loader";

class Post extends PureComponent {
  constructor(props) {
    super(props);
  }
  createPost(imageUrl) {
    const { navigation, creatingPost, onCreatePostSuccess, addNewFeed } = this.props;
    // session user unique id
    const { uid, email } = Firebase.auth().currentUser;
    // set post creation in progress
    createPost(true);
    Database
      .ref("post")
      .push({
        userId: uid,
        email,
        imageUrl
      })
      .then(postSnapshot => {
        // navigate to post
        const result = navigation.navigate("Feed");
        // post created successfully
        onCreatePostSuccess();
        addNewFeed({
          postId: postSnapshot.key,
          imageUrl,
          userId: uid
        });
        navigation.navigate("Feed");
      })
      .catch(err => {
        // error in creating post
      });
  }
  render() {
    const { creatingPost } = this.props;
    return creatingPost
      ? <Loader />
      : <Camera onImageUpload={this.createPost.bind(this)} />;
  }
}

const mapStateToProps = ({ postPage }) => {
  return {
    creatingPost: postPage.creatingPost
  };
};
const mapDispatchToProps = dispatch => {
  return {
    createPost() {
      dispatch(createPost());
    },
    onCreatePostSuccess() {
      dispatch(onCreatePostSuccess());
    },
    addNewFeed(details) {
      dispatch(addNewFeed(details))
    }
  };
};

Post = connect(mapStateToProps, mapDispatchToProps)(Post);

export default Post;
