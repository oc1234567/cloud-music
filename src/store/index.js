import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import reducer from './reducer';
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middlewares = [thunk];
if (process.env.NODE_ENV === "development") {
    const logger = createLogger();
    middlewares.push(logger);
}

const store = createStore(reducer, composeEnhancers(applyMiddleware(...middlewares)));

export default store;