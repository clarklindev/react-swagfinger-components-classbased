//react
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { BrowserRouter } from 'react-router-dom';
//reducer
import profileReducer from './store/reducers/profile';
import authReducer from './store/reducers/auth';
import uiReducer from './store/reducers/ui';
//app
import App from './App';
import './index.scss';
import * as serviceWorker from './serviceWorker';

//axios
// import axios from 'axios';

const logger = (store) => {
  return (next) => {
    return (action) => {
      //console.log('[Middleware] Dispatching action: ', action);
      //console.log('[Middleware] state: ', store.getState());
      return next(action);
    };
  };
};

const rootReducer = combineReducers({
  profile: profileReducer,
  auth: authReducer,
  ui: uiReducer,
});
const composeEnhancers =
  process.env.NODE_ENV === 'development'
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    : null || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(logger, thunk))
);

//intercepting request/response
// axios.interceptors.request.use(
//   (request) => {
//     console.log('REQUEST CONFIG: ', request);
//     return request; //return else it is blocked..
//   },
//   (error) => {
//     console.log('ERROR: ', error);
//     return Promise.reject(error); //reject to also be able to handle with catch()
//   }
// );
// axios.interceptors.response.use(
//   (response) => {
//     console.log('Response', response);
//     return response; //return else it is blocked..
//   },
//   (error) => {
//     console.log('ERROR: ', error);
//     return Promise.reject(error); //reject to also be able to handle with catch()
//   }
// );

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
