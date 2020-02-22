import React, { Component } from 'react';
import Backdrop from '../Backdrop/Backdrop';
import DefaultPageLayout from '../../../hoc/DefaultPageLayout/DefaultPageLayout';
import classes from './Modal.module.scss';
import Card from '../Card/Card';

class Modal extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.show !== this.props.show;
  }

  render() {
    return this.props.show ? (
      <React.Fragment>
        <Backdrop show={this.props.show} onClick={this.props.modalClosed} />
        <DefaultPageLayout type='LayoutNarrow'>
          <div className={classes.Modal}>
            <Card hide={!this.props.show}>{this.props.children}</Card>
          </div>
        </DefaultPageLayout>
      </React.Fragment>
    ) : null;
  }
}

export default Modal;
