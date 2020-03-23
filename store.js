import { createStore, combineReducers } from 'redux';
import feedPageReducer from "./screens/Feed/store/reducer";
import postPageReducer from "./screens/Camera/store/reducer";
import profilePageReducer from "./screens/Profile/store/reducer";
import CommonReducer from "./common/store/reducer";

const rootReducer = combineReducers({
    feedPage: feedPageReducer,
    postPage: postPageReducer,
    profilePage: profilePageReducer,
    common: CommonReducer
});

export default store = createStore(rootReducer);