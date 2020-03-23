import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import Firebase, { Database } from "../../config/firebase";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      credentials: {
        email: "",
        password: "",
        username: "",
        fullName: ""
      },
      // flag to check if the user signup is in progress
      // this flag is used to show the loader on screen
      addingUser: false
    };
    // this is done in order for "this" class reference to be available in this method
    this.setUserSignupStatus = this.setUserSignupStatus.bind(this);
  }

  updateText(text, field) {
    let newCredentials = Object.assign(this.state.credentials);
    newCredentials[field] = text;
    this.setState({
      credentials: newCredentials
    });
  }

  register() {
    const { credentials } = this.state;
    const { email, password, username, fullName } = credentials;
    const { navigation } = this.props;
    // check if all the fields are given
    if (email && password && username && fullName) {
      // notify to view that signup is in progress
      this.setUserSignupStatus(true);
      // signup user in firebase
      Firebase.auth()
        .createUserWithEmailAndPassword(email, password)
        .then(data => {
          console.log("DATA", data);
          console.log({
            userId: data.user.uid,
            fullName,
            username
          });
          return Database.ref("users").push({
            userId: data.user.uid,
            fullName,
            username
          });
        })
        .then(() => {
          this.setUserSignupStatus(false);
          // signup successfull
          // navigate to main screen
          navigation.navigate("Main");
        })
        .catch(err => {
          console.log("err", err);
          this.setUserSignupStatus(false);
          alert(err.message);
        });
    } else {
      alert("Please fill all the required fields!!!");
    }
  }
  setUserSignupStatus(status) {
    this.setState({
      addingUser: status
    });
  }
  render() {
    const { addingUser } = this.state;
    return addingUser
      ? <ActivityIndicator size="large" style={styles.loadingIndicator} />
      : <View
          style={{
            height: 100 + "%",
            width: 100 + "%",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgb(252,61,57)"
          }}
        >

          <TextInput
            value={this.state.email}
            placeholder="Email"
            autoCorrect={false}
            style={styles.input}
            onChangeText={text => this.updateText(text, "email")}
          />
          <TextInput
            value={this.state.password}
            onChangeText={text => this.updateText(text, "password")}
            autoCorrect={false}
            secureTextEntry
            placeholder="Password"
            style={styles.input}
          />
          <TextInput
            value={this.state.username}
            onChangeText={text => this.updateText(text, "username")}
            autoCorrect={false}
            placeholder="Username"
            style={styles.input}
          />
          <TextInput
            value={this.state.fullName}
            onChangeText={text => this.updateText(text, "fullName")}
            autoCorrect={false}
            placeholder="Full Name"
            style={styles.input}
          />
          <Button title="Signup" onPress={this.register.bind(this)} />
        </View>;
  }
}

const styles = StyleSheet.create({
  input: {
    height: 50,
    width: 100 + "%",
    marginHorizontal: 20,
    backgroundColor: "rgb(255,255,255)",
    marginBottom: 10
  },
  // show loading indicator on the center of the screen
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
export default Register;
