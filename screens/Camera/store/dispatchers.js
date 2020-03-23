import Actions from "./actions";

export function createPost() {
    return {
        type: Actions.CREATE_POST
    };
}

export function onCreatePostSuccess() {
    return {
        type: Actions.ON_CREATE_POST_SUCCESS
    };
}