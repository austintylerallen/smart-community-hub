import { combineReducers } from 'redux';

// Example reducer
const exampleReducer = (state = {}, action) => {
    switch (action.type) {
        default:
            return state;
    }
};

export default combineReducers({
    example: exampleReducer,
});
