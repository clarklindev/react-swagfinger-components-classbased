import React, { Component } from "react";
import classes from "./DraggableItem.module.scss";
import Button from "../Button/Button";
import Icon from "./Icon";

class DraggableItem extends Component {
  render() {
    return (
      <div className={classes.DraggableItem}>
        <Button type="WithPadding">
          <Icon iconstyle="fas" code="grip-vertical" size="sm" />
        </Button>
        {this.props.children}
      </div>
    );
  }
}

export default DraggableItem;
