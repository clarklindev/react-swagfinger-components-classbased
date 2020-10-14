import React, { PureComponent } from 'react';
import Backdrop from '../Backdrop/Backdrop';
import DefaultPageLayout from '../../../hoc/DefaultPageLayout/DefaultPageLayout';
import classes from './Modal.module.scss';
import Card from '../Card/Card';
import Button from '../Button/Button';
import Icon from '../InputComponents/Icon';
import ModalHeader from '../Headers/ModalHeader';
class Modal extends PureComponent {
  render() {
    const header = this.props.isInteractive ? (
      <React.Fragment>
        <ModalHeader>{this.props.label}</ModalHeader>

        <Button
          type='NoStyle'
          onClick={event => {
            event.preventDefault();
            this.props.modalClosed();
          }}
        >
          <Icon iconstyle='fas' code='times' size='sm'></Icon>
        </Button>
      </React.Fragment>
    ) : null;

    const footer = this.props.isInteractive ? this.props.footer ? this.props.footer : 
      <React.Fragment>
        <Button
          onClick={event => {
            event.preventDefault();
            this.props.modalClosed();
          }}
          type='WithBorder'
        >
          Cancel
        </Button>
        <Button
          onClick={event => {
            event.preventDefault();
            this.props.continue();
          }}
          type='WithBorder'
        >
          Continue
        </Button>
      </React.Fragment>
    : null;

    return this.props.show ? (
      <React.Fragment>
        <Backdrop show={this.props.show} onClick={this.props.modalClosed} />
        <DefaultPageLayout type='LayoutNarrow' label=''>
          <div className={classes.Modal}>
            <Card
              type='NoPadding'
              hide={!this.props.show}
              header={header}
              footer={footer}
            >
              <div className={classes.Message}>{this.props.children}</div>
            </Card>
          </div>
        </DefaultPageLayout>
      </React.Fragment>
    ) : null;
  }
}

export default Modal;
