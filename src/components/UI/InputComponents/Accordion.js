import React, { PureComponent } from 'react';
import classes from './Accordion.module.scss';
import Icon from './Icon';
class Accordion extends PureComponent {
  state = {
    isActive: [],
  };

  constructor(props) {
    super(props);
    this.accordionRef = React.createRef();
  }

  componentDidMount() {
    this.setMaxHeights();
  }

  componentDidUpdate() {
    this.setMaxHeights();
  }

  setMaxHeights = () => {
    let accordion = this.accordionRef.current;

    Array.from(
      accordion.querySelectorAll("[class*='AccordionContent']")
    ).forEach((item, index) => {
      if (this.state.isActive[index]) {
        item.style.maxHeight = item.scrollHeight + 'px';
      } else {
        item.style.maxHeight = 0;
      }

      if (this.state.isActive[index] === undefined) {
        this.setState((prevState) => {
          let oldState = prevState.isActive;
          let copiedState = [...oldState];
          copiedState[index] =
            this.props.openOnStartIndex >= 0 &&
            this.props.openOnStartIndex === index
              ? true
              : false;
          return { isActive: copiedState };
        });
      }
    });
  };

  onClickHandler = (index, event) => {
    console.log(index);
    this.setState((prevState) => {
      let dataClone = [...prevState.isActive];
      let updatedClone = dataClone.map((value, i) => {
        if (i === index) {
          return !value;
        } else {
          return this.props.allowMultiOpen === true ? value : false;
        }
      });
      console.log('updatedClone: ', updatedClone);
      return {
        isActive: updatedClone,
      };
    });
  };

  render() {
    return (
      <div className={classes.Accordion} ref={this.accordionRef}>
        {this.props.children.map((item, index) => {
          //is Active?
          let additionalClasses = [];
          if (this.state.isActive[index] === true) {
            additionalClasses.push(classes.Active);
          }
          //has hover?
          let styleClasses = [];
          if (this.props.hovereffect === true) {
            styleClasses = [classes.AccordionItemHover];
          }

          return (
            <div
              className={[classes.AccordionItem, ...styleClasses].join(' ')}
              style={{ ...this.props.style }}
              key={'accordionitem' + index}>
              <div
                className={classes.AccordionTitle}
                onClick={(event) => {
                  this.onClickHandler(index, event);
                  if (item.props.onClick) {
                    item.props.onClick(); //onClick on the item...
                  }
                  if (this.props.onClick) {
                    this.props.onClick(); //onClick on the prop...
                  }
                }}>
                {item.props.label ? item.props.label : null}
                <Icon
                  iconstyle='fas'
                  code={
                    this.state.isActive[index] === true
                      ? 'chevron-up'
                      : 'chevron-down'
                  }
                  size='sm'
                />
              </div>
              <div
                className={[
                  classes.AccordionContent,
                  ...additionalClasses,
                ].join(' ')}>
                {item.props.children ? item.props.children : null}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default Accordion;
