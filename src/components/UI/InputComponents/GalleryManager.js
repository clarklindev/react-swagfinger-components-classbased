import React, { Component } from "react";
import "./GalleryManager.module.scss";
import classes from "./GalleryManager.module.scss";

import InputContext from "../../../context/InputContext";

import Button from "../Button/Button";
import Icon from "./Icon";
import ErrorList from "./ErrorList";

import GalleryItem from "./GalleryItem";
import FlexRow from "../../../hoc/Layout/FlexRow";
import FlexColumn from "../../../hoc/Layout/FlexColumn";
import DraggableItem from "./DraggableItem";
// Class allows us to move items of the gallery
// Add and Remove items from gallery

class GalleryManager extends Component {
  static contextType = InputContext;

  constructor(props) {
    super(props);
  }

  state = {
    isOpenList: {}, //keeping track of arrow direction on select input,
    //we need this because we cannot set a class to render() else all instances arrows change at same time
  };

  onClickHandler = () => {};

  onBlurHandler = () => {};

  onChangeHandler = () => {};

  render() {
    const addbutton = (
      <Button
        title="Add"
        type="WithBorder"
        className={classes.AddButton}
        onClick={(event) => {
          this.context.addinput(event, this.props.name, {
            key: "",
            value: "",
          });
        }}
      >
        <Icon iconstyle="fas" code="plus" size="sm" />
        <p>Add</p>
      </Button>
    );

    return (
      <div className={classes.GalleryManager}>
        {this.props.value.length ? (
          <div className={classes.GalleryItemsWrapper}>
            <ul>
              {this.props.value.map((val, index) => {
                let tempKey = val.data.key;
                let tempVal = val.data.value;
                let tempClasses = [];
                if (this.state.isOpenList[index] === true) {
                  tempClasses.push(classes.IsOpen);
                }
                if (
                  (tempKey !== "" &&
                    tempKey !== undefined &&
                    tempKey !== null) ||
                  (tempVal !== "" && tempVal !== undefined && tempVal !== null)
                ) {
                  tempClasses.push(classes.SelectStyling);
                }
                let error = null;
                let errorClasses = [];
                if (
                  this.props.validation &&
                  !val.valid &&
                  (val.touched || (!val.touched && !val.pristine))
                ) {
                  errorClasses.push(classes.Invalid);
                  error = <ErrorList value={{ data: val.errors }} />;
                }
                const galleryitem = (
                  <React.Fragment>
                    <select
                      name={this.props.name + index}
                      value={tempKey}
                      className={[...tempClasses].join(" ")}
                      onClick={(event) => this.onClickHandler(index, event)}
                      onBlur={(event) => {
                        this.onBlurHandler(index, event);
                      }}
                      onChange={(event) => this.onChangeHandler(index, event)}
                    >
                      {this.props.elementconfig.options.map((option, index) => (
                        <option key={option.value} value={option.value}>
                          {option.displaytext}
                        </option>
                      ))}
                    </select>
                    <Button
                      title="Delete"
                      type="WithPadding"
                      className={classes.RemoveButton}
                      onClick={(event) => {
                        this.context.removeinput(event, this.props.name, index);

                        this.setState((prevState) => {
                          let open = Object.keys(prevState.isOpenList).filter(
                            (item, j) => {
                              return index !== j;
                            }
                          );

                          return {
                            isOpenList: open,
                          };
                        });
                      }}
                    >
                      <Icon iconstyle="far" code="trash-alt" size="sm" />
                    </Button>
                  </React.Fragment>
                );
                return (
                  <li key={this.props.name + index}>
                    <div className={classes.ItemWrapper}>
                      {this.props.value.length > 1 ? (
                        <DraggableItem>
                          {/* metadata content */}
                          {galleryitem}
                        </DraggableItem>
                      ) : (
                        galleryitem
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
        {addbutton}
      </div>
    );
  }
}

export default GalleryManager;
