import * as actionTypes from './constants';
import { fromJS } from 'immutable';

const defaultState = fromJS({
    rankList: [],
    enterLoading: true,
});

export default (state = defaultState, action) => {
    switch (action.type) {
        case actionTypes.CHANGE_RANK_LIST:
            return state.set('rankList', action.data);
        case actionTypes.CHANGE_ENTER_LOADING:
            return state.set('enterLoading', action.data);
        default:
            return state;
    }
}

