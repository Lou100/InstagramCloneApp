import Actions from "./actions";

const defaultState = {
    creatingPost: false
};

function reducer(state = defaultState, action) {
    switch(action.type) {
        case Actions.CREATE_POST:
            return {
                ...state,
                creatingPost: true
            };
        case Actions.ON_CREATE_POST_SUCCESS:
            return {
                ...state,
                creatingPost: false
            }
        default:
            return {...state};
    }
}

export default reducer;