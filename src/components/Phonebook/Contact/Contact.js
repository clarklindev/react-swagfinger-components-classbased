import React, { Component } from 'react';
import classes from './Contact.module.scss';
import Utils from '../../../Utils';
class Contact extends Component {
  constructor(props) {
    super(props);

    this.className = Utils.getClassNameString([
      classes.Contact,
      Contact.name,
      this.props.className
    ]);

    this.displayTextRef = React.createRef();
  }

  componentDidMount() {
    this.displayTextRef.current.innerHTML = this.props.displayText;
  }

  componentDidUpdate() {
    this.displayTextRef.current.innerHTML = this.props.displayText;
  }
  render() {
    return (
      <div className={this.className}>
        <p ref={this.displayTextRef}></p>
      </div>
    );
  }
}
export default Contact;
