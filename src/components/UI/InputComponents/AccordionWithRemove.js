import React, { PureComponent } from 'react';
import classes from './AccordionWithRemove.module.scss';
import Icon from './Icon';
import FlexRow from '../../../hoc/Layout/FlexRow';
class AccordionWithRemove extends PureComponent {
  state = {
    isActive: [],
  };

  constructor(props) {
    super(props);
    this.accordionRef = React.createRef();
  }

  componentDidMount() {
    this.setupHeights();
  }

  componentDidUpdate() {
    this.setupHeights();
  }

  setupHeights = () => {
    let accordion = this.accordionRef.current;

    Array.from(
      accordion.querySelectorAll("[class*='AccordionContent']")
    ).forEach((item, index) => {
      if (this.state.isActive[index]) {
        item.style.maxHeight = item.scrollHeight + 'px';
        //find the AccordionItem and also sets its maxHeight
      } else {
        item.style.maxHeight = 0;
      }

      //this is required to prevent infinite loop as we are calling setstate in componentdidupdate
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

      return {
        isActive: updatedClone,
      };
    });
  };

  render() {
    return (
      <div className={classes.AccordionWithRemove} ref={this.accordionRef}>
        {this.props.children.map((item, index) => {
          console.log('prop: ', item);
          let additionalClasses = [];
          if (this.state.isActive[index] === true) {
            additionalClasses.push(classes.Active);
          }
          let styleClasses = [];
          if (this.props.hovereffect === true) {
            styleClasses = [classes.AccordionItemHover];
          }
          return (
            <FlexRow>
              <div
                className={[classes.AccordionItem, ...styleClasses].join(' ')}>
                <div
                  className={classes.AccordionTitle}
                  onClick={(event) => {
                    this.onClickHandler(index, event);
                  }}>
                  <div className={classes.AccordionLabel}>
                    {item.props.label}
                  </div>
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
                  {item.props.children}
                </div>
              </div>
              {this.props.removeButton ? this.props.removeButton : null}
            </FlexRow>
          );
        })}
      </div>
    );
  }
}

export default AccordionWithRemove;
