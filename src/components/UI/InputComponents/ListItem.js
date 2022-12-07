import React, { Component } from 'react';
import classes from './ListItem.module.scss';
import { stringHelper } from '../../../shared';
class ListItem extends Component {
  constructor(props) {
    super(props);

    this.className = stringHelper.getUniqueClassNameString([
      classes.ListItem,
      ListItem.name,
      this.props.className
    ]);

    this.displayTextRef = React.createRef();
    this.extraTextRef = React.createRef();
  }

  componentDidMount() {
    if (this.props.displayText) {
      this.displayTextRef.current.innerHTML = this.props.displayText;
    }
    if (this.props.extraText) {
      this.extraTextRef.current.innerHTML = this.props.extraText;
    }
  }

  componentDidUpdate() {
    if (this.props.displayText) {
      this.displayTextRef.current.innerHTML = this.props.displayText;
    }
    if (this.props.extraText) {
      this.extraTextRef.current.innerHTML = this.props.extraText;
    }
  }
  render() {
    let displayText = this.props.displayText ? (
      <p ref={this.displayTextRef}></p>
    ) : null;
    let hasExtraText = this.props.extraText ? (
      <p ref={this.extraTextRef}></p>
    ) : null;

    let styleClasses = [];
    if (this.props.hovereffect === true) {
      styleClasses = [classes.ListItemHover];
    }

    return (
      <div
        className={[this.className, ...styleClasses].join(' ')}
        style={this.props.style}
        onClick={this.props.onClick}
        title={this.props.title}
      >
        <div className={[classes.ListItemWrapper]} style={this.props.style}>
          {displayText || hasExtraText ? (
            <div>
              {displayText}
              {hasExtraText}
            </div>
          ) : null}
          {this.props.children}
        </div>
      </div>
    );
  }
}
export default ListItem;
