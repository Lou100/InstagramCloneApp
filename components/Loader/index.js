import React from "react";
import { ActivityIndicator, StyleSheet } from "react-native";

export default function Loader() {
  return <ActivityIndicator size="large" style={styles.loadingIndicator} />;
}

const styles = StyleSheet.create({
  loadingIndicator: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  }
});
