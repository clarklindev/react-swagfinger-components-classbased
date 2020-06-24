import React, { Component } from 'react';
import classes from './ListItem.module.scss';
import '../../../shared/alignFlex.module.scss'; //align classes
import Utils from '../../../Utils';
class ListItem extends Component {
  constructor(props) {
    super(props);

    this.className = Utils.getClassNameString([
      classes.ListItem,
      ListItem.name,
      this.props.className,
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

    console.log('ALIGN TYPE: ', this.props.align);
    return (
      <div
        className={[this.className, ...styleClasses].join(' ')}
        onClick={this.props.onClick}
        title={this.props.title}
      >
        <div className={[classes.ListItemWrapper, this.props.align].join(' ')}>
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
