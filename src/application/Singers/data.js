import React, { createContext, useReducer } from 'react';

export const DataContext = createContext({});

//action types
export const CHANGE_CATEGORY = 'singers/change_category';
export const CHANGE_ALPHA = 'singers/change_alpha';

//initial state
const initialState = {
    category: '',
    alpha: '',
}

const reducer = (state, action) => {
    switch (action.type) {
        case CHANGE_CATEGORY:
            return {
                ...state,
                category: action.data
            }
        case CHANGE_ALPHA:
            return {
                ...state,
                alpha: action.data
            }
        default:
            return state;
    }
}

function DataProvider(props) {

    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <DataContext.Provider value={{data: state, dispatch: dispatch}}>
            {props.children}
        </DataContext.Provider>
    )
}

export default DataProvider;