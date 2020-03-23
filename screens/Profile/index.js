import React, { Component } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Button,
  StyleSheet,
  Image
} from "react-native";
import { connect } from "react-redux";
import Firebase, { Database } from "../../config/firebase";
import { setFollowStatus } from "./store/dispatchers";
import {
  Username,
  UserDisplayName,
  UserDescription,
  UserProfileImage
} from "../../components/User";
import UserPosts from "./UserPosts";
import Loader from "../../components/Loader";

class Profile extends Component {
  componentDidMount() {
    const { userId, users, setFollowStatus } = this.props;
    const { uid: sessionUserId } = Firebase.auth().currentUser;
    if (userId && userId !== sessionUserId) {
      const user = users.find(user => user.content.userId === sessionUserId);
      // check if the session is already following this user
      Database.ref(`users/${user.key}`)
        .child("followers")
        .orderByChild("userId")
        .equalTo(userId)
        .once("value", snapshot => {
          if (snapshot.val()) {
            // session user is following this user
            setFollowStatus(true);
          }
        });
    }
  }
  login() {
    this.props.navigation.navigate("main");
    //Navigation to Main App
  }
  logout() {
    const { navigation } = this.props;
    // logout from application
    Firebase.auth().signOut().then(_ => {
      // redirect to login
      navigation.navigate("Login");
    });
  }
  follow() {
    const { users, userId, setFollowStatus, isFollowing } = this.props;
    const { uid: sessionUserId } = Firebase.auth().currentUser;
    const user = users.find(user => user.content.userId === sessionUserId);
    if (!isFollowing) {
      setFollowStatus(true);
      Database.ref(`users/${user.key}`).child("followers").push({
        userId
      });
    } else {
      // unfollow user
      setFollowStatus(false);
      Database.ref(`users/${user.key}`)
        .child("followers")
        .once("value", snapshot => {
          let userKey = null;
          snapshot.forEach(child => {
            if (child.val().userId === userId) {
              userKey = child.key;
            }
          });
          if (userKey) {
            Database.ref(`users/${user.key}/followers/${userKey}`).remove();
          }
        });
    }
  }
  render() {
    const { uid: sessionUserId } = Firebase.auth().currentUser;
    const {
      navigation,
      fetchingPost,
      postsFetched,
      posts,
      isFollowing
    } = this.props;
    let { userId } = this.props;
    let isASessionUser = false;
    if (!userId || userId === sessionUserId) {
      // this is a session user
      isASessionUser = true;
    }
    if (!userId) {
      userId = sessionUserId;
    }

    return (
      <SafeAreaView>
        <ScrollView>
          <View style={styles.navigationContainer}>
            <Username style={styles.userNameText} userId={userId} />
          </View>
          <View style={styles.userStasticsContainer}>
            <UserProfileImage style={styles.profileImage} userId={userId} />
            <View style={styles.stasticsContainer}>
              <Text style={styles.highlightText}>56</Text>
              <Text>Posts</Text>
            </View>
            <View style={styles.stasticsContainer}>
              <Text style={styles.highlightText}>1148</Text>
              <Text>Followers</Text>
            </View>
            <View style={styles.stasticsContainer}>
              <Text style={styles.highlightText}>865</Text>
              <Text>Following</Text>
            </View>
          </View>
          <View style={styles.userFullNameContainer}>
            <UserDisplayName userId={userId} style={styles.highlightText} />
            <UserDescription userId={userId} />
          </View>
          {isASessionUser === true
            ? <TouchableOpacity
                onPress={_ => navigation.navigate("EditProfile")}
                style={[
                  styles.editProfileButtonContainer,
                  styles.actionButtonContainer
                ]}
              >
                <Text style={styles.editProfileText}>Edit Profile</Text>
              </TouchableOpacity>
            : <TouchableOpacity
                onPress={this.follow.bind(this)}
                style={[
                  styles.followButtonContainer,
                  styles.actionButtonContainer
                ]}
              >
                <Text style={styles.followText}>
                  {isFollowing ? "Following" : "Follow"}
                </Text>
              </TouchableOpacity>}
          <UserPosts userId={userId} />
          <TouchableOpacity
            onPress={this.logout.bind(this)}
            style={styles.logoutButton}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  navigationContainer: {
    marginTop: 15,
    alignItems: "center"
  },
  userNameText: {
    fontSize: 20,
    fontWeight: "bold"
  },
  userStasticsContainer: {
    flexDirection: "row",
    marginTop: 10
  },
  profileImage: {
    marginLeft: 10,
    marginRight: 10,
    width: 65,
    height: 70,
    borderRadius: 40
  },
  stasticsContainer: {
    width: 80,
    justifyContent: "center",
    alignItems: "center",
    height: 70
  },
  highlightText: {
    fontWeight: "bold",
    fontSize: 18
  },
  userFullNameContainer: {
    marginLeft: 10
  },
  actionButtonContainer: {
    marginTop: 30,
    height: 30,
    justifyContent: "center",
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 5,
    alignItems: "center"
  },
  editProfileButtonContainer: {
    borderWidth: 0.5,
    borderColor: "#D3D3D3"
  },
  followButtonContainer: {
    backgroundColor: "#2E8FEE"
  },
  editProfileText: {
    fontWeight: "bold"
  },
  followText: {
    fontWeight: "bold",
    color: "white"
  },
  logoutButton: {
    marginLeft: 10,
    marginTop: 10,
    width: 150,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0C83FE"
  },
  logoutText: {
    fontWeight: "bold",
    color: "white"
  }
});

const mapStateToProps = ({ common, profilePage }) => {
  return {
    users: common.users,
    isFollowing: profilePage.isFollowing
  };
};
const mapDispatchToProps = dispatch => {
  return {
    setFollowStatus(status) {
      dispatch(setFollowStatus(status));
    }
  };
};

Profile = connect(mapStateToProps, mapDispatchToProps)(Profile);

export default Profile;
