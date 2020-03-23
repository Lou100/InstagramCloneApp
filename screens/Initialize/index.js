import React, { PureComponent } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { onFetchUsersSuccess } from "../../common/store/dispatchers";
import Firebase, { Database } from "../../config/firebase";

class Initialize extends PureComponent {
  constructor() {
    super();
    this.state = {
      // check if user is already logged in
      checkingLoggedInStatus: false
    };
    // this is done in order for "this" class reference to be available in this method
    this.setLoggedInStatus = this.setLoggedInStatus.bind(this);
  }
  componentDidMount() {
    const { navigation, onFetchUsersSuccess } = this.props;
    // check if the user is already logged in
    // show loader while verification is in progress
    this.setLoggedInStatus(true);
    // Fetch all users info
    // this is to map user basic details with the userId
    Database.ref("users").once("value", snapshot => {
      const users = [];
      snapshot.forEach(child => {
        users.push({
          content: child.val(),
          key: child.key
        });
      });
      Firebase.auth().onAuthStateChanged(user => {
        this.setLoggedInStatus(false);
        if (user) {
          // user is already logged in, redirect to Feed screen
          navigation.navigate("Feed");
        } else {
          navigation.navigate("Login");
        }
      });
      onFetchUsersSuccess(users);
    });
  }
  setLoggedInStatus(status) {
    this.setState({
      checkingLoggedInStatus: status
    });
  }
  render() {
    const { checkingLoggedInStatus } = this.state;
    return checkingLoggedInStatus
      ? <ActivityIndicator size="large" style={styles.loadingIndicator} />
      : null;
  }
}

const styles = StyleSheet.create({
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

const mapDispatchToProps = dispatch => {
  return {
    onFetchUsersSuccess(users) {
      dispatch(onFetchUsersSuccess(users));
    }
  };
};

Initialize = connect(null, mapDispatchToProps)(Initialize);

export default Initialize;
