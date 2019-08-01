import React, { Component } from 'react';
import { connect } from 'react-redux';

class Phonebook extends Component {
	render() {
		return <h1>Phonebook {this.props.ctr}</h1>;
	}
}

const mapStateToProps = state => {
	return { ctr: state.counter };
};

export default connect(mapStateToProps)(Phonebook);
