import React, { Component } from 'react';
import Backdrop from '../Backdrop/Backdrop';
import DefaultPageLayout from '../../../hoc/DefaultPageLayout/DefaultPageLayout';
import classes from './Modal.module.scss';
import Card from '../Card/Card';
import Button from '../Button/Button';
import Icon from '../InputComponents/Icon';
import ModalHeader from '../Headers/ModalHeader';
class Modal extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.show !== this.props.show;
  }

  render() {
    const header = (
      <React.Fragment>
        <ModalHeader>{this.props.label}</ModalHeader>
        <Button type='NoStyle' onClick={this.props.modalClosed}>
          <Icon iconstyle='fas' code='times' size='sm'></Icon>
        </Button>
      </React.Fragment>
    );
    const footer = (
      <Button onClick={this.props.modalClosed} type='WithBorder'>
        Continue
      </Button>
    );
    return this.props.show ? (
      <React.Fragment>
        <Backdrop show={this.props.show} onClick={this.props.modalClosed} />
        <DefaultPageLayout
          type='LayoutNarrow'
          label={this.props.label ? this.props.label : ''}>
          <div className={classes.Modal}>
            <Card
              type='NoPadding'
              hide={!this.props.show}
              header={header}
              footer={footer}>
              <div className={classes.Message}>{this.props.children}</div>
            </Card>
          </div>
        </DefaultPageLayout>
      </React.Fragment>
    ) : null;
  }
}

export default Modal;
