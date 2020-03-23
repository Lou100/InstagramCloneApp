import React from "react";
import { Image, StyleSheet } from "react-native";

export default function Avatar() {
  return (
    <Image
      style={styles.userPic}
      source={{
        uri:
          "https://lh3.googleusercontent.com/w2NfoY10rD3NiO57sgt8OZ8Z6hDT5MvkV2spJHL9PVScV-50Tv6DRxCA7qMcXTCLMFipxPwLUZCFaV-QYN8l9-wvbg"
      }}
    />
  );
}

const styles = StyleSheet.create({
  userPic: {
    height: 40,
    width: 40,
    borderRadius: 20
  }
});
