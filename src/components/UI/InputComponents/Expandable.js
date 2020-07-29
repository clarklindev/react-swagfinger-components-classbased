import React, { Component } from 'react';
import classes from './Expandable.module.scss';
import Button from '../Button/Button';
import Icon from './Icon';

// single element of an accordion
class Expandable extends Component {
  constructor(props) {
    super(props);
    this.expandableRef = React.createRef();
    this.headerRef = React.createRef();
  }

  state = {
    isOpen: this.props.isActive,
  };

  componentDidMount() {
    this.setMaxHeight();
  }

  componentDidUpdate() {
    console.log('expandable componentDidUpdate');
    if (this.props.isActive !== this.state.isOpen) {
      this.setState({ isOpen: this.props.isActive });
    }
    this.setMaxHeight();
  }

  setMaxHeight = () => {
    const container = this.expandableRef.current;
    const header = this.headerRef.current;

    console.log('container: ', container);
    if (this.props.isActive === true) {
      container.style.maxHeight = container.scrollHeight + 'px';
    } else {
      container.style.maxHeight = header.offsetHeight + 'px';
    }
  };
  onClickHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('onClickHandler');
    this.setState((prevState) => {
      return { isOpen: !prevState.isOpen };
    });

    if (this.props.onClick) {
      this.props.onClick(event);
    }
  };

  render() {
    //is Active?
    let additionalClasses = [];
    if (this.state.isOpen === true) {
      additionalClasses.push(classes.Active);
    }
    let validationClasses = [];
    if (this.props.isValid === false) {
      validationClasses.push(classes.Invalid);
    }

    return (
      <div className={classes.Expandable} ref={this.expandableRef}>
        <div
          className={[
            classes.Header,
            ...additionalClasses,
            ...validationClasses,
          ].join(' ')}
          ref={this.headerRef}
          onClick={(event) => this.onClickHandler(event)}>
          {this.props.title ? this.props.title : null}
          <Button type='NoStyle' className={classes.ExpandButton}>
            <Icon
              iconstyle='fas'
              code={this.state.isOpen ? 'chevron-up' : 'chevron-down'}
              size='sm'
            />
          </Button>
        </div>
        <div
          className={[
            classes.Body,
            ...additionalClasses,
            ...validationClasses,
          ].join(' ')}>
          {this.props.children ? this.props.children : null}
        </div>
      </div>
    );
  }
}

export default Expandable;
