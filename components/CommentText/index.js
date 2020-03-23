import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Username, UserProfileImage } from "../../components/User";
import Avatar from "../Avatar";

function CommentText({ userId, message }) {
  return (
    <View style={styles.messageContainer}>
      <UserProfileImage style={styles.profileImage} userId={userId} />
      <View style={styles.contentContainer}>
        <View>
          <Username style={styles.author} userId={userId} />
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    flex: 1,
    flexDirection: "row",
    marginBottom: 10
  },
  contentContainer: {
    marginLeft: 5
  },
  author: {
    fontWeight: "bold"
  },
  message: {
    width: 300
  },
  profileImage: {
    height: 40,
    width: 40,
    borderRadius: 20
  }
});

export default CommentText;
