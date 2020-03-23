import React from "react";
// setup firebase
import "./config/firebase";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import LoginScreen from "./screens/Login";
import RegisterScreen from "./screens/Register";
import FeedScreen from "./screens/Feed";
import GuestProfileScreen from "./screens/Feed/screens/GuestProfile";
import CameraScreen from "./screens/Camera";
import ProfileScreen from "./screens/Profile";
import EditProfileScreen from "./screens/Profile/screens/EditProfile";
import InitializeScreen from "./screens/Initialize";

const navigationOptions = {
  header: null
};

const FeedStack = createStackNavigator({
  Feed: {
    screen: FeedScreen,
    navigationOptions
  },
  GuestProfile: {
    screen: GuestProfileScreen,
    navigationOptions: {
      title: "Profile"
    }
  }
});

const ProfileStack = createStackNavigator({
  Profile: {
    screen: ProfileScreen,
    navigationOptions
  },
  EditProfile: {
    screen: EditProfileScreen
  }
});

const Tabs = createBottomTabNavigator({
  Feed: FeedStack,
  Camera: CameraScreen,
  Profile: ProfileStack
});

const AuthStack = createStackNavigator({
  Initialize: {
    screen: InitializeScreen,
    navigationOptions
  },
  Login: {
    screen: LoginScreen,
    navigationOptions
  },
  Register: {
    screen: RegisterScreen,
    navigationOptions
  }
});
const App = createSwitchNavigator({
  Auth: {
    screen: AuthStack
  },
  Main: {
    screen: Tabs
  }
});

export default createAppContainer(App);
