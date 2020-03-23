import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity
} from "react-native";
import { connect } from "react-redux";
import {
  onLikeDislikePost,
  setPostLikeDetails,
  onAddCommentSuccess,
  onDeleteCommentSuccess
} from "./store/dispatchers";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Firebase, { Database } from "../../config/firebase";
import { Username, UserProfileImage } from "../../components/User";
import Comments from "../../components/Comments";
import CommentBox from "../../components/CommentBox";
import config from "../../config/constants";

class Post extends PureComponent {
  inputRef = null;
  constructor() {
    super();
    this.state = {
      screenWidth: Dimensions.get("window").width
    };
  }
  componentDidMount() {
    const { feed, setPostLikeDetails } = this.props;
    const { uid: sessionUserId } = Firebase.auth().currentUser;
    this.getPostRef().child("likes").once("value", snapshot => {
      let totalLikes = 0;
      let liked = false;
      snapshot.forEach(child => {
        totalLikes += 1;
        const userId = child.val().userId;
        if (sessionUserId === userId) {
          liked = true;
        }
      });
      setPostLikeDetails({
        postId: feed.key,
        totalLikes,
        liked
      });
    });
  }
  getPostRef() {
    const { feed } = this.props;
    return Database.ref(`post/${feed.key}`);
  }
  getUserPostLikeRef() {
    const { feed } = this.props;
    const { uid: sessionUserId } = Firebase.auth().currentUser;
    return this.getPostRef()
      .child("likes")
      .orderByChild("userId")
      .equalTo(sessionUserId);
  }
  likeToggled() {
    const { feed, onLikeDislikePost } = this.props;
    const { uid: sessionUserId } = Firebase.auth().currentUser;
    const postRef = this.getPostRef();
    const sessionUserPostLikeRef = this.getUserPostLikeRef();
    sessionUserPostLikeRef.once("value", snapshot => {
      if (!snapshot.val()) {
        // like this post
        postRef.child("likes").push({
          userId: sessionUserId
        });
        onLikeDislikePost(feed.key);
      } else {
        // remove like from this post
        this.getUserPostLikeRef().once("value", snapshot => {
          snapshot.forEach(child => {
            this.getPostRef().child(`likes/${child.key}`).remove();
            onLikeDislikePost(feed.key);
          });
        });
      }
      // console.log("snapshot key", snapshot.key);
    });
  }
  focusCommentInput() {
    if (this.inputRef) {
      this.inputRef.focus();
    }
  }
  addComment(message) {
    const { feed, onAddCommentSuccess } = this.props;
    const { uid: sessionUserId } = Firebase.auth().currentUser;
    const comment = {
      userId: sessionUserId,
      message
    };
    Database.ref(`post/${feed.key}`)
      .child("comments")
      .push(comment)
      .then(commentSnap => {
        comment.key = commentSnap.key;
        onAddCommentSuccess({ ...comment, postId: feed.key });
      });
  }
  onDeleteComment(comment) {
    const { feed, onDeleteCommentSuccess } = this.props;
    const commentId = comment.content.key;
    Database.ref(`post/${feed.key}/comments/${commentId}`).remove();
    onDeleteCommentSuccess({ postId: feed.key, commentId });
  }
  render() {
    const { feed, navigation } = this.props;
    const { content } = feed;
    const comments = content.comments || [];
    return (
      <View style={{ flex: 1, width: 100 + "%" }}>
        <View style={styles.userBar}>
          <TouchableOpacity
            onPress={_ =>
              navigation.navigate("GuestProfile", { userId: content.userId })}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <UserProfileImage style={styles.userPic} userId={content.userId} />
            <Username style={{ marginLeft: 10 }} userId={content.userId} />
          </TouchableOpacity>
          {/*<View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 30 }}>...</Text>
          </View>*/}

        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            this.likeToggled();
          }}
        >
          <Image
            style={{ width: this.state.screenWidth, height: 400 }}
            source={{
              uri: content.imageUrl
            }}
          />
        </TouchableOpacity>
        <View style={styles.iconBar}>
          <TouchableOpacity onPress={this.likeToggled.bind(this)}>
            {content.liked
              ? <FontAwesome
                  name="heart"
                  style={{
                    marginLeft: 10,
                    color: "rgb(252,61,57)",
                    fontSize: 35
                  }}
                />
              : <FontAwesome
                  name="heart-o"
                  style={{
                    marginLeft: 10,
                    fontSize: 35
                  }}
                />}
          </TouchableOpacity>
          <TouchableOpacity onPress={this.focusCommentInput.bind(this)}>
            <FontAwesome
              name="comment-o"
              style={{ marginLeft: 10, marginRight: 5, fontSize: 35 }}
            />
          </TouchableOpacity>

          {/*<Image
            style={[
              styles.icon,
              { height: 40, width: 40, tintColor: heartIconColor }
            ]}
            source={config.images.heartIcon}
          />*/}
          {/*<Image
            style={[styles.icon, { height: 33, width: 33 }]}
            source={config.images.bubbleIcon}
          />*/}
          {/*<Image
            resizeMode="stretch"
            style={[styles.icon, { height: 50, width: 40 }]}
            source={config.images.arrowIcon}
          />*/}
        </View>
        <View style={styles.iconBar}>
          {/*<Image
            style={[styles.icon, { height: 40, width: 40 }]}
            source={config.images.heartIcon}
          />*/}
          <Text
            style={styles.likesCountText}
          >{`${content.totalLikes} ${content.totalLikes > 1
            ? "Likes"
            : "Like"}`}</Text>
        </View>
        <Comments
          onDeleteComment={this.onDeleteComment.bind(this)}
          comments={comments}
        />
        <CommentBox
          onSend={this.addComment.bind(this)}
          inputRef={input => (this.inputRef = input)}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  tempNav: {
    width: 100 + "%",
    height: 56,
    marginTop: 20,
    backgroundColor: "rgb(250,250,250)",
    borderBottomColor: "rgb(233,233,233)",
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: "center",
    alignItems: "center"
  },
  userBar: {
    width: 100 + "%",
    height: config.styleConstants.rowHeight,
    backgroundColor: "rgb(255,255,255)",
    flexDirection: "row",
    paddingHorizontal: 10,
    justifyContent: "space-between"
  },

  userPic: {
    height: 40,
    width: 40,
    borderRadius: 20
  },

  iconBar: {
    height: config.styleConstants.rowHeight,
    width: 100 + "%",
    borderColor: "rgb(233,233,233)",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center"
  },
  icon: {
    marginLeft: 5
  },
  commentBar: {
    width: 100 + "%",
    height: config.styleConstants.rowHeight,
    borderColor: "rgb(233,233,233)",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  likesCountText: {
    marginLeft: 10,
    fontWeight: "bold"
  }
});

const mapStateToProps = ({ feedPage }) => {
  return {
    posts: [...feedPage.posts]
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onLikeDislikePost(postId) {
      dispatch(onLikeDislikePost(postId));
    },
    setPostLikeDetails(details) {
      dispatch(setPostLikeDetails(details));
    },
    onAddCommentSuccess(details) {
      dispatch(onAddCommentSuccess(details));
    },
    onDeleteCommentSuccess(details) {
      dispatch(onDeleteCommentSuccess(details));
    }
  };
};

Post = connect(mapStateToProps, mapDispatchToProps)(Post);

export default Post;
