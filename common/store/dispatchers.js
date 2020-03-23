import Actions from "./actions";

export function onFetchUsersSuccess(details) {
    return {
        type: Actions.ON_FETCH_USERS_SUCCESS,
        details
    };
}

export function updateUserDetails(details) {
    return {
        type: Actions.ON_UPDATE_USER_DETAILS_SUCCESS,
        details
    };
}