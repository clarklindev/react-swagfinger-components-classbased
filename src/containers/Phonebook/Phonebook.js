import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions/actionsTypes';
import AddContact from '../../components/AddContact/AddContact';
import Contact from '../../components/Contact/Contact';
import classes from './Phonebook.module.scss';
import Utils from '../../Utils';

class Phonebook extends Component {
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
						{this.props.phoneBook.map(phonebookEntry => {
							console.log(phonebookEntry);
							return (
								<li className={classes.Li} key={phonebookEntry.id}>
									<Contact
										id={phonebookEntry.id}
										name={phonebookEntry.name}
										contact={phonebookEntry.contact}
										onUpdated={this.props.onContactUpdated}
										toggleEditMode={this.toggleEditingHandler}
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
	return { phoneBook: state.phoneBook };
};

const mapDispatchToProps = dispatch => {
	return {
		onContactAdded: ({ id, name, contact }, reset) => {
			dispatch({
				type: actionTypes.ADD_CONTACT,
				contactData: { id: id, name: name, contact: contact }
			});
			reset();
		},

		onContactUpdated: ({ id, name, contact }, toggleEditMode) => {
			dispatch({
				type: actionTypes.UPDATE_CONTACT,
				contactData: { id: id, name: name, contact: contact }
			});
			toggleEditMode();
		},

		onContactRemoved: id =>
			dispatch({ type: actionTypes.REMOVE_CONTACT, contactId: id })
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Phonebook);
