import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';
import AddContact from '../../components/AddContact/AddContact';
import Contact from '../../components/Contact/Contact';
import classes from './Phonebook.module.scss';
import Utils from '../../Utils';

class Phonebook extends Component {
	componentDidMount() {
		this.props.onFetchContacts();
	}

	render() {
		const className = Utils.getClassNameString([
			classes.Phonebook,
			Phonebook.name,
			this.props.className
		]);

		return (
			<div className={className}>
				<h1>Phonebook</h1>

				<AddContact contactAdded={this.props.onContactAdded} />

				<div>
					<ul className={classes.Ul}>
						{console.log('here!!!: ', this.props.storedPhonebook)}
						{this.props.storedPhonebook.map(phonebookEntry => {
							return (
								<li className={classes.Li} key={phonebookEntry.id}>
									<Contact
										id={phonebookEntry.id}
										name={phonebookEntry.name}
										contact={phonebookEntry.contact}
										onUpdated={this.props.onContactUpdated}
									/>

									<button
										onClick={() =>
											this.props.onContactRemoved(phonebookEntry.id)
										}
									>
										Delete
									</button>
								</li>
							);
						})}
					</ul>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return { storedPhonebook: state.phoneBook };
};

const mapDispatchToProps = dispatch => {
	return {
		onContactAdded: (contact, reset) => {
			dispatch(actions.processAddContact(contact));
			reset();
		},

		onContactRemoved: id => dispatch(actions.processRemoveContact(id)),

		onContactUpdated: (contact, toggleEditMode) => {
			dispatch(actions.processUpdateContact(contact));
			toggleEditMode();
		},

		onFetchContacts: () => {
			dispatch(actions.fetchContacts());
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Phonebook);
