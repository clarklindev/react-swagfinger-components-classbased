import React, { PureComponent } from 'react';
import classes from './AccordionWithRemove.module.scss';
import Icon from './Icon';
import FlexRow from '../../../hoc/Layout/FlexRow';
import DraggableItem from './DraggableItem';
import Button from '../../UI/Button/Button';

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
    console.log('this.props.isValid: ', this.props.isValid);
    return (
      <div className={classes.AccordionWithRemove} ref={this.accordionRef}>
        {this.props.children.map((item, index) => {
          console.log('prop: ', item);

          let additionalClasses = [];
          let validationClasses = [];
          if (this.state.isActive[index] === true) {
            additionalClasses.push(classes.Active);
          }

          console.log('this.props.isValid[0]: ', this.props.isValid[0]);
          console.log('this.props.isValid[1]: ', this.props.isValid[1]);
          console.log('this.props.isValid[2]: ', this.props.isValid[2]);
          if (this.props.isValid[index] === false) {
            console.log('valid? ', this.props.isValid[index]);
            validationClasses.push(classes.Invalid);
          }
          let styleClasses = [];
          if (this.props.hovereffect === true) {
            styleClasses.push(classes.AccordionItemHover);
          }

          return (
            <div
              className={classes.AccordionWithRemove}
              key={this.props.name + index}>
              <FlexRow>
                <div
                  className={[
                    classes.AccordionItem,
                    ...styleClasses,
                    ...additionalClasses,
                    ...validationClasses,
                  ].join(' ')}>
                  <DraggableItem
                    style={[
                      'Embedded',
                      this.state.isActive[index] ? 'Active' : null,
                    ]}>
                    <div
                      className={classes.AccordionTitle}
                      onClick={(event) => {
                        this.onClickHandler(index, event);
                      }}>
                      <div className={classes.AccordionLabel}></div>
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
                  </DraggableItem>
                  <div
                    className={[
                      classes.AccordionContent,
                      ...additionalClasses,
                      ...validationClasses,
                    ].join(' ')}>
                    {item}
                  </div>
                </div>
                <Button
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    this.props.onRemove(this.props.name, index);
                  }}
                  title='Delete'
                  type='WithBorder'
                  className={classes.RemoveButton}>
                  <Icon iconstyle='far' code='trash-alt' size='sm' />
                </Button>
              </FlexRow>
            </div>
          );
        })}
      </div>
    );
  }
}

export default AccordionWithRemove;
