import React from "react";
import Profile from "../../../Profile";

export default function GuestProfile({
    navigation
}) {
    const { userId } = navigation.state.params;
    return <Profile navigation={navigation} userId={userId} />
}