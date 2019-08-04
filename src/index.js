//react
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

//app
import App from './App';
import './index.css';
import * as serviceWorker from './serviceWorker';

//redux
import reducer from './store/reducers/contact';

const logger = store => {
	return next => {
		return action => {
			console.log('[Middleware] Dispatching action: ', action);
			console.log('[Middleware] state: ', store.getState());
			return next(action);
		};
	};
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
	reducer,
	/* preloadedState, */ composeEnhancers(applyMiddleware(logger, thunk))
);

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
