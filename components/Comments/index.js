import React, { PureComponent } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import Firebase from "../../config/firebase";
import CommentText from "../../components/CommentText";

class Comments extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hasViewAllComments: false,
      comments: [],
      visibleComments: []
    };
  }
  componentDidMount() {
    const { comments } = this.props;
    let visibleComments = [];
    if (comments.length === 1) {
      visibleComments = [...comments];
    }
    this.setState({
      hasViewAllComments: comments.length > 1 ? true : false,
      comments: [...comments],
      visibleComments: [...visibleComments]
    });
  }
  componentDidUpdate(prevProps) {
    if (prevProps.comments.length !== this.props.comments.length) {
      const comments = this.props.comments.filter(
        comment => comment.content.newlyAddedComment
      );
      // remove those comments which are deleted one
      const visibleComments = [
        ...this.state.visibleComments
      ].reduce((acc, visibleComment) => {
        const commentExist = this.props.comments.find(
          comment => comment.content.key === visibleComment.content.key
        );
        if(commentExist) {
          acc.push({...visibleComment});
        }
        return acc;
      }, []);
      this.setState({
        comments: [...this.props.comments],
        // show have unique list of visible comments
        // if we don't do this, we will see duplicate comments
        visibleComments: [
          ...visibleComments,
          ...comments
        ].reduce((acc, value) => {
          const commentFound = acc.find(
            comment => comment.content.key === value.content.key
          );
          if (!commentFound) {
            acc.push({ ...value });
          }
          return acc;
        }, [])
      });
    }
  }
  viewAllComments() {
    if (this.state.hasViewAllComments) {
      this.setState({
        hasViewAllComments: false,
        comments: [...this.state.comments],
        visibleComments: [...this.state.comments]
      });
    }
  }
  onDeleteComment(comment) {
    const { onDeleteComment } = this.props;
    // take confirmation from user to delete the comment
    Alert.alert("Delete Comment", "Are you sure to delete this comment?", [
      { text: "No" },
      {
        text: "Yes",
        onPress: () => {
          onDeleteComment(comment);
        }
      }
    ]);
  }
  render() {
    const { comments, visibleComments, hasViewAllComments } = this.state;
    let commentHeaderTitle = "";
    if (comments.length > 1 && hasViewAllComments) {
      commentHeaderTitle = `View All ${comments.length} comments`;
    } else {
      commentHeaderTitle = `${comments.length} ${comments.length > 1
        ? "Comments"
        : "Comment"}`;
    }
    const { uid: sessionUserId } = Firebase.auth().currentUser;
    return (
      <View>
        <View style={styles.commentsHeader}>
          <TouchableOpacity onPress={this.viewAllComments.bind(this)}>
            <Text style={styles.commentsHeaderText}>
              {commentHeaderTitle}
            </Text>
          </TouchableOpacity>
        </View>
        {visibleComments.map(comment => {
          // display delete icon to only session user
          const isSessionUserComment = comment.content.userId === sessionUserId;
          return (
            <TouchableOpacity style={styles.messageContainer}>
              <CommentText
                userId={comment.content.userId}
                message={comment.content.message}
              />
              {isSessionUserComment
                ? <TouchableOpacity
                    onPress={_ => this.onDeleteComment(comment)}
                    style={styles.deleteMessageContainer}
                  >
                    <AntDesign
                      name="delete"
                      style={{
                        fontSize: 15
                      }}
                    />
                  </TouchableOpacity>
                : null}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  commentsHeader: {
    marginLeft: 10,
    marginBottom: 10
  },
  commentsHeaderText: {
    fontWeight: "bold",
    color: "#C8C8C8"
  },
  messageContainer: {
    flexDirection: "row"
  },
  deleteMessageContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15
  }
});

export default Comments;
