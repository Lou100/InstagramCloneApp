import React, { PureComponent } from "react";
import { connect } from "react-redux";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity
} from "react-native";
import Loader from "../../../../components/Loader";
import Firebase, { Database } from "../../../../config/firebase";
import Camera from "../../../../components/Camera";
import config from "../../../../config/constants";
import { updateUserDetails } from "../../../../common/store/dispatchers";

class EditProfile extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      changeProfilePhoto: false,
      updatingProfile: false,
      userDetails: {
        key: null,
        fullName: "",
        username: "",
        description: "",
        imageUrl: ""
      }
    };
  }
  componentDidMount() {
    const { users } = this.props;
    const { uid: sessionUserId } = Firebase.auth().currentUser;
    const {
      content: {
        fullName = "",
        username = "",
        description = "",
        imageUrl = ""
      },
      key
    } = users.find(user => user.content.userId === sessionUserId);
    this.setState({
      userDetails: {
        key,
        fullName,
        username,
        description,
        imageUrl
      }
    });
  }
  onChangeFullName(fullName) {
    this.setState({
      userDetails: {
        ...this.state.userDetails,
        fullName
      }
    });
  }
  onChangeUsername(username) {
    this.setState({
      userDetails: {
        ...this.state.userDetails,
        username
      }
    });
  }
  onChangeDescription(description) {
    this.setState({
      userDetails: {
        ...this.state.userDetails,
        description
      }
    });
  }
  onChangeProfilePhoto() {
    this.setState({
      changeProfilePhoto: true
    });
  }
  onUserProfileImageUpload(imageUrl) {
    const { userDetails: { key } } = this.state;
    this.props.updateUserDetails({
      ...this.state.userDetails,
      imageUrl
    });
    this.setState({
      changeProfilePhoto: false,
      userDetails: {
        ...this.state.userDetails,
        imageUrl
      }
    });
    Database.ref(`users/${key}`).update({
      imageUrl
    });
  }
  onUpdateProfile() {
    const { navigation, updateUserDetails } = this.props;
    const {
      userDetails: { key, username, fullName, description }
    } = this.state;
    this.setState({
      updatingProfile: true
    });
    Database.ref(`users/${key}`)
      .update({
        fullName,
        username,
        description
      })
      .then(_ => {
        // redirect to Profile screen
        navigation.navigate("Profile");
        updateUserDetails(this.state.userDetails);
        this.setState({
          updatingProfile: false
        });
      });
  }
  render() {
    const { userDetails, changeProfilePhoto, updatingProfile } = this.state;
    const { fullName, username, description, imageUrl } = userDetails;

    return changeProfilePhoto
      ? <Camera onImageUpload={this.onUserProfileImageUpload.bind(this)} />
      : <SafeAreaView>
          {updatingProfile
            ? <Loader />
            : <ScrollView keyboardShouldPersistTaps={true}>
                <View style={styles.imageContainer}>
                  <View style={styles.imageInnerContainer}>
                    {!imageUrl
                      ? <Image
                          style={styles.userImage}
                          source={config.images.defaultUserImage}
                        />
                      : <Image
                          style={[styles.userImage, styles.alreadyProfileImage]}
                          source={{
                            uri: imageUrl
                          }}
                        />}

                    <TouchableOpacity
                      onPress={this.onChangeProfilePhoto.bind(this)}
                    >
                      <Text style={styles.changeProfileText}>
                        Change Profile Photo
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.editProfileForm}>
                  <TextInput
                    placeholder="Name"
                    value={fullName}
                    onChangeText={this.onChangeFullName.bind(this)}
                    style={styles.textInput}
                    placeholderStyle={styles.placeholderStyle}
                  />
                  <TextInput
                    placeholder="Username"
                    value={username}
                    onChangeText={this.onChangeUsername.bind(this)}
                    style={styles.textInput}
                    placeholderStyle={styles.placeholderStyle}
                  />
                  <TextInput
                    placeholder="Description"
                    value={description}
                    onChangeText={this.onChangeDescription.bind(this)}
                    multiline={true}
                    textAlignVertical="top"
                    style={[styles.textInput]}
                    placeholderStyle={styles.placeholderStyle}
                  />
                </View>
                <TouchableOpacity
                  onPress={this.onUpdateProfile.bind(this)}
                  style={styles.submitButton}
                >
                  <Text style={styles.updateProfileText}>Update Profile</Text>
                </TouchableOpacity>
              </ScrollView>}
        </SafeAreaView>;
  }
}

const styles = StyleSheet.create({
  imageContainer: {
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  imageInnerContainer: {
    alignItems: "center"
  },
  editProfileForm: {
    marginLeft: 10,
    marginTop: 10,
    width: "90%",
    flex: 1
  },
  label: {
    fontSize: 12,
    color: "#BBBBBB"
  },
  textInput: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#BBBBBB",
    marginBottom: 10
  },
  descriptionInput: {
    height: 100
  },
  placeholderStyle: {
    borderColor: "red"
  },
  changeProfileText: {
    marginTop: 10,
    fontSize: 18,
    color: "#0C83FE"
  },
  userImage: { height: 100, width: 100 },
  alreadyProfileImage: {
    borderRadius: 50
  },
  submitButton: {
    marginLeft: 10,
    marginTop: 10,
    width: 150,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0C83FE"
  },
  updateProfileText: {
    color: "white",
    fontWeight: "bold"
  }
});

const mapStateToProps = ({ common }) => {
  return {
    users: common.users
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateUserDetails(details) {
      dispatch(updateUserDetails(details));
    }
  };
};

EditProfile = connect(mapStateToProps, mapDispatchToProps)(EditProfile);

export default EditProfile;
