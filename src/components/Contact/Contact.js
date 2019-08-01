import React from 'react';
import classes from './Contact.module.scss';
import Utils from '../../Utils';
const Contact = props => {
	let className = Utils.getClassNameString([
		classes.Contact,
		Contact.name,
		props.className
	]);
	return (
		<div className={className} onClick={props.clicked}>
			<h3>{props.name}</h3>
			<p>{props.contact}</p>
		</div>
	);
};
export default Contact;
