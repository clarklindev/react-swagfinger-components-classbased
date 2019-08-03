import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../../store/actions/index';
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
		onContactAdded: (contact, reset) => {
			dispatch(actionCreators.storeContact(contact));
			reset();
		},

		onContactUpdated: (contact, toggleEditMode) => {
			dispatch(actionCreators.updateContact(contact));
			toggleEditMode();
		},

		onContactRemoved: id => dispatch(actionCreators.removeContact(id))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Phonebook);
