import React, { Component } from 'react';
import classes from './EditContact.module.scss';
import Utils from '../../Utils';
class EditContact extends Component {
	state = {
		id: this.props.id,
		name: this.props.name,
		contact: this.props.contact
	};

	nameChangeHandler = event => {
		this.setState({ name: event.target.value });
	};

	contactChangeHandler = event => {
		this.setState({ contact: event.target.value });
	};

	render() {
		let className = Utils.getClassNameString([
			classes.EditContact,
			EditContact.name,
			this.props.className
		]);
		return (
			<div className={className}>
				<input
					type="text"
					placeholder="name"
					onChange={this.nameChangeHandler}
					value={this.state.name}
				/>
				<input
					type="text"
					placeholder="contact"
					onChange={this.contactChangeHandler}
					value={this.state.contact}
				/>
				<button
					onClick={() => {
						if (
							this.state.name.trim() !== '' &&
							this.state.contact.trim() !== ''
						) {
							return this.props.onUpdated(
								{
									id: this.state.id,
									name: this.state.name,
									contact: this.state.contact
								},
								this.props.toggleEditMode
							);
						}
					}}
				>
					update
				</button>
				<button onClick={this.props.toggleEditMode}>cancel</button>
			</div>
		);
	}
}
export default EditContact;
