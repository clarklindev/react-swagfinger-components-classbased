import React, { Component } from 'react';
import classes from './Accordion.module.scss';
import Icon from './Icon';
class Accordion extends Component {
  state = {
    data: [
      { title: 'question1', content: 'content1', isActive: false },
      { title: 'question2', content: 'content2', isActive: false },
      { title: 'question3', content: 'content3', isActive: false }
    ],
    startIndex: 0
  };

  constructor(props) {
    super(props);
    this.accordionRef = React.createRef();
  }

  componentDidUpdate() {
    console.log(this.state);
    let accordion = this.accordionRef.current;

    Array.from(accordion.querySelectorAll("[class*='AccordionContent']")).map(
      (item, index) => {
        if (this.state.data[index].isActive) {
          item.style.maxHeight = item.scrollHeight + 'px';
        } else {
          item.style.maxHeight = 0;
        }
      }
    );
  }

  onClickHandler = (index, event) => {
    console.log(index);

    this.setState((prevState) => {
      let dataClone = [...prevState.data];
      let updatedClone = dataClone.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            isActive: true
          };
        } else {
          return {
            ...item,
            isActive: false
          };
        }
      });

      return {
        data: updatedClone
      };
    });
  };

  render() {
    return (
      <div className={classes.Accordion} ref={this.accordionRef}>
        {this.state.data.map((item, index) => {
          let additionalClasses = [];
          if (this.state.data[index].isActive === true) {
            additionalClasses.push(classes.Active);
          }
          return (
            <div
              className={classes.AccordionItem}
              key={'accordionitem' + index}>
              <div
                className={classes.AccordionTitle}
                onClick={(event) => this.onClickHandler(index, event)}>
                {item.title}
                <Icon
                  iconstyle='fas'
                  code={
                    this.state.data[index].isActive
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
                ].join(' ')}>
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
