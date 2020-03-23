import React, { PureComponent } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text
} from "react-native";

class CommentBox extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      message: ""
    };
  }
  onChangeMessage(message) {
    this.setState({
      message
    });
  }
  onSend() {
    const { message } = this.state;
    const { onSend } = this.props;
    if (message.trim() !== "") {
      this.setState({
        message: ""
      });
      onSend(message);
    }
  }
  render() {
    const { message } = this.state;
    const { inputRef, onSend } = this.props;
    return (
      <View style={styles.commentBoxContainer}>
        <TextInput
          value={message}
          onChangeText={this.onChangeMessage.bind(this)}
          ref={inputRef}
          placeholder="Comment"
          style={styles.textInput}
        />
        <TouchableOpacity
          onPress={this.onSend.bind(this)}
          style={styles.buttonContainer}
        >
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  commentBoxContainer: {
    flex: 1,
    flexDirection: "row",
    marginRight: 10,
    marginBottom: 10
  },
  textInput: {
    width: "75%",
    marginLeft: 10,
    marginRight: 10,
    borderWidth: 0.2,
    borderRadius: 5,
    height: 40
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ECECEC",
    borderRadius: 5
  },
  buttonText: {
    fontWeight: "bold"
  }
});

export default CommentBox;
