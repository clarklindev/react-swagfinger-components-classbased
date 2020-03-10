import React, { Component } from 'react';
import classes from './Accordion.module.scss';
import Icon from './Icon';
class Accordion extends Component {
  state = {
    isActive: []
  };

  constructor(props) {
    super(props);
    this.accordionRef = React.createRef();
  }

  componentDidMount() {
    let accordion = this.accordionRef.current;

    Array.from(
      accordion.querySelectorAll("[class*='AccordionContent']")
    ).forEach((item, index) => {
      console.log('dom: ', item, ', index: ', index);

      if (this.state.isActive[index]) {
        item.style.maxHeight = item.scrollHeight + 'px';
      } else {
        item.style.maxHeight = 0;
      }

      this.setState(prevState => {
        let oldState = prevState.isActive;
        let copiedState = [...oldState];
        copiedState[index] =
          this.props.openOnStartIndex > 0 &&
          this.props.openOnStartIndex === index
            ? true
            : false;
        return { isActive: copiedState };
      });
    });
  }

  componentDidUpdate() {
    let accordion = this.accordionRef.current;

    Array.from(
      accordion.querySelectorAll("[class*='AccordionContent']")
    ).forEach((item, index) => {
      if (this.state.isActive[index]) {
        item.style.maxHeight = item.scrollHeight + 'px';
      } else {
        item.style.maxHeight = 0;
      }
    });
  }

  onClickHandler = (index, event) => {
    console.log(index);
    this.setState(prevState => {
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
        isActive: updatedClone
      };
    });
  };

  render() {
    return (
      <div className={classes.Accordion} ref={this.accordionRef}>
        {this.props.value.map((item, index) => {
          console.log('prop: ', item);
          let additionalClasses = [];
          if (this.state.isActive[index] === true) {
            additionalClasses.push(classes.Active);
          }
          return (
            <div
              className={classes.AccordionItem}
              key={'accordionitem' + index}
            >
              <div
                className={classes.AccordionTitle}
                onClick={event => this.onClickHandler(index, event)}
              >
                {item.title}
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
                  ...additionalClasses
                ].join(' ')}
              >
                {item.content}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default Accordion;
