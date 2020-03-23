import React from "react";
import { connect } from "react-redux";
import { Text, Image } from "react-native";
import config from "../../config/constants";

function Username({ userId, users, style }) {
  const userDetails = getUserDetails(userId, users);
  return <Text style={style}>{userDetails ?  userDetails.content.username : ""}</Text>;
}

function UserDisplayName({ userId, users, style }) {
  const userDetails = getUserDetails(userId, users);
  return <Text style={style}>{userDetails ? userDetails.content.fullName : ""}</Text>;
}

function UserDescription({ userId, users, style }) {
  const userDetails = getUserDetails(userId, users);
  return <Text style={style}>{userDetails ? userDetails.content.description : ""}</Text>;
}

function UserProfileImage({ userId, users, style }) {
  const userDetails = getUserDetails(userId, users);
  return userDetails ? 
  ( 
    userDetails.content.imageUrl
      ? <Image
          style={style}
          source={{
            uri: userDetails.content.imageUrl
          }}
        />
      : <Image
          style={style}
          source={config.images.defaultUserImage}
        />
  ) : <Text />;
}

function getUserDetails(userId, users) {
  return users.find(user => user.content.userId === userId);
}

const mapStateToProps = ({ common }) => {
  return {
    users: common.users
  };
};

Username = connect(mapStateToProps, null)(Username);
UserDisplayName = connect(mapStateToProps, null)(UserDisplayName);
UserDescription = connect(mapStateToProps, null)(UserDescription);
UserProfileImage = connect(mapStateToProps, null)(UserProfileImage);

export { Username, UserDisplayName, UserDescription, UserProfileImage };
