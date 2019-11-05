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
    this.extraTextRef = React.createRef();
  }

  componentDidMount() {
    this.displayTextRef.current.innerHTML = this.props.displayText;
    this.extraTextRef.current.innerHTML = this.props.extraText;
  }

  componentDidUpdate() {
    this.displayTextRef.current.innerHTML = this.props.displayText;
    this.extraTextRef.current.innerHTML = this.props.extraText;
  }
  render() {
    return (
      <div className={this.className}>
        <div className={classes.Labeledgroup}>
          <p ref={this.displayTextRef}></p>
          <p ref={this.extraTextRef}></p>
        </div>
      </div>
    );
  }
}
export default Contact;
