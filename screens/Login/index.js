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
import Firebase from "firebase";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      credentials: {
        email: "",
        password: ""
      },
      // flag to check if the authentication is in progress
      // this flag is used to show the loader on screen
      authenticating: false
    };
    // this is done in order for "this" class reference to be available in this method
    this.setAuthenticationStatus = this.setAuthenticationStatus.bind(this);
  }
  updateText(text, field) {
    let newCredentials = Object.assign(this.state.credentials);
    newCredentials[field] = text;
    this.setState({
      credentials: newCredentials
    });
  }
  login() {
    // this is Object destructuring in Javascript ES6
    const { credentials } = this.state;
    const { email, password } = credentials;
    // if all field given
    if (email && password) {
      // notify to view that authentication is in progress
      this.setAuthenticationStatus(true);
      // authenticate with firebase
      Firebase.auth()
        .signInWithEmailAndPassword(email, password)
        .then(details => {
          this.setAuthenticationStatus(false);
        })
        .catch(err => {
          this.setAuthenticationStatus(false);
          alert(err.message);
        });
    } else {
      alert("Please fill all the required fields!!!");
    }
  }
  setAuthenticationStatus(status) {
    this.setState({
      authenticating: status
    });
  }
  render() {
    const { navigation } = this.props;
    const { authenticating } = this.state;
    return authenticating
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
            autoCapitalize="none"
            value={this.state.email}
            placeholder="username"
            autoCorrect={false}
            style={styles.input}
            onChangeText={text => this.updateText(text, "email")}
          />
          <TextInput
            autoCapitalize="none"
            value={this.state.password}
            onChangeText={text => this.updateText(text, "password")}
            secureTextEntry
            autoCorrect={false}
            placeholder="Password"
            style={styles.input}
          />
          <Button
            title="Login"
            onPress={() => {
              this.login();
            }}
          />

          <Button
            title="No account? Sign up here!"
            onPress={() => navigation.navigate("Register")}
          />

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
export default Login;
