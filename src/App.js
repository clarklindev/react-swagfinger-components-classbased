import React, { Component } from 'react';

//3rd party
import axios from './axios-contacts';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
//js
import './App.scss';
import reducer from './store/reducers/contact';
import Phonebook from './containers/Phonebook/Phonebook';

class App extends Component {
	componentDidMount() {}

	render() {
		const logger = store => {
			return next => {
				return action => {
					console.log('[Middleware] Dispatching action: ', action);
					console.log('[Middleware] state: ', store.getState());
					return next(action);
				};
			};
		};

		const composeEnhancers =
			window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

		const store = createStore(
			reducer,
			/* preloadedState, */ composeEnhancers(applyMiddleware(logger, thunk))
		);

		return (
			<Provider store={store}>
				<div className="App">
					<Phonebook />
				</div>
			</Provider>
		);
	}
}

export default App;
