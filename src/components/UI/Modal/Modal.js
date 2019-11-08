import React, { Component } from 'react';
import classes from './Modal.module.scss';
import Backdrop from '../Backdrop/Backdrop';

class Modal extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.show !== this.props.show;
  }
  UNSAFE_componentWillUpdate() {
    console.log('[Modal] WillUpdate');
  }
  render() {
    return (
      <React.Fragment>
        <Backdrop show={this.props.show} clicked={this.props.modalClosed} />
        <div
          className={classes.Modal}
          style={{
            display: this.props.show ? 'block' : 'none'
          }}>
          {this.props.children}
        </div>
      </React.Fragment>
    );
  }
}

export default Modal;
