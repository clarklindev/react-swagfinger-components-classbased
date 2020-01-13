//react
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { BrowserRouter } from 'react-router-dom';
//reducer
import contactReducer from './store/reducers/contact';
import authReducer from './store/reducers/auth';

//app
import App from './App';
import './index.scss';
import * as serviceWorker from './serviceWorker';

const logger = (store) => {
  return (next) => {
    return (action) => {
      console.log('[Middleware] Dispatching action: ', action);
      console.log('[Middleware] state: ', store.getState());
      return next(action);
    };
  };
};

const rootReducer = combineReducers({
  contact: contactReducer,
  auth: authReducer
});
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(logger, thunk))
);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
