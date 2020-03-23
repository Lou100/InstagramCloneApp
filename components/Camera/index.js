import React, { PureComponent } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  ActivityIndicator
} from "react-native";
import ImagePicker from "react-native-image-picker";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Firebase from "firebase";
import { RNCamera } from "react-native-camera";
// this package is required to convert the image taken from react-native-camera
// to the blob data
// Because we are going to save blob data to Firebase database
import RNFetchBlob from "react-native-fetch-blob";
const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

const imagePickerOptions = {
  title: "Select Image",
  storageOptions: {
    skipBackup: true,
    path: "images"
  }
};

class Camera extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      uploadingImage: false,
      cameraType: RNCamera.Constants.Type.back
    };
    this.takePicture = this.takePicture.bind(this);
    this.setImageUploadStatus = this.setImageUploadStatus.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.pickImage = this.pickImage.bind(this);
    this.handleCameraType = this.handleCameraType.bind(this);
  }
  takePicture = async () => {
    const { onImageUpload } = this.props;
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);
      this.uploadImage(data.uri)
        .then(imageUrl => {
          // image URL returned by Firebase
          // save the user post in the firebase
          onImageUpload(imageUrl);
        })
        .catch(err => {
          // there was some error uploading image to Firebase
          console.log("err", err);
        });
    }
  };
  setImageUploadStatus(status) {
    this.setState({
      uploadingImage: status
    });
  }
  uploadImage(imageUri) {
    // show image upload in progress
    this.setImageUploadStatus(true);
    const mime = "application/octet-stream";
    // converting image into blob and saving it in firebase database
    const uploadUri = Platform.OS === "ios"
      ? imageUri.replace("file://", "")
      : imageUri;
    let uploadBlob = null;

    // unique file name
    const fileName = new Date().getTime();
    const imageRef = Firebase.storage()
      .ref("images")
      .child(fileName.toString());
    return fs
      .readFile(uploadUri, "base64")
      .then(data => {
        return Blob.build(data, { type: `${mime};BASE64` });
      })
      .then(blob => {
        uploadBlob = blob;
        return imageRef.put(blob, { contentType: mime });
      })
      .then(() => {
        uploadBlob.close();
        // image upload successfull
        this.setImageUploadStatus(false);
        return imageRef.getDownloadURL();
      })
      .catch(err => {
        this.setImageUploadStatus(false);
      });
  }
  pickImage() {
    const { onImageUpload } = this.props;
    ImagePicker.launchImageLibrary(imagePickerOptions, response => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        this.uploadImage(response.uri).then(imageUrl => onImageUpload(imageUrl));
      }
    });
  }
  handleCameraType() {
    const { cameraType } = this.state;
    this.setState({
      cameraType: cameraType === RNCamera.Constants.Type.back
        ? RNCamera.Constants.Type.front
        : RNCamera.Constants.Type.back
    });
  }
  render() {
    const { uploadingImage, creatingPost, cameraType } = this.state;
    return uploadingImage === true || creatingPost === true
      ? <ActivityIndicator size="large" style={styles.loadingIndicator} />
      : <View style={styles.container}>
          <RNCamera
            ref={ref => {
              this.camera = ref;
            }}
            style={styles.preview}
            type={cameraType}
            //flashMode={RNCamera.Constants.FlashMode.on}
            androidCameraPermissionOptions={{
              title: "Permission to use camera",
              message: "We need your permission to use your camera",
              buttonPositive: "Ok",
              buttonNegative: "Cancel"
            }}
          />
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              margin: 30
            }}
          >
            <TouchableOpacity
              style={{
                alignSelf: "flex-end",
                alignItems: "center",
                backgroundColor: "transparent"
              }}
              onPress={this.pickImage}
            >
              <Ionicons
                name="ios-photos"
                style={{ color: "#fff", fontSize: 40 }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                alignSelf: "flex-end",
                alignItems: "center",
                backgroundColor: "transparent"
              }}
              onPress={this.takePicture.bind(this)}
            >
              <FontAwesome
                name="camera"
                style={{ color: "#fff", fontSize: 40 }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                alignSelf: "flex-end",
                alignItems: "center",
                backgroundColor: "transparent"
              }}
              onPress={this.handleCameraType}
            >
              <MaterialCommunityIcons
                name="camera-switch"
                style={{ color: "#fff", fontSize: 40 }}
              />
            </TouchableOpacity>
          </View>
        </View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "black"
  },
  preview: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  capture: {
    flex: 0,
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: "center",
    margin: 20
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default Camera;
