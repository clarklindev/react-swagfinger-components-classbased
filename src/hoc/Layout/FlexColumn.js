import React, { Component } from "react";
import classes from "./FlexColumn.module.scss";
import * as alignClasses from "../../shared/alignFlex";

class FlexColumn extends Component {
  render() {
    const spacingClasses = [];
    if (this.props.spacing === "left") {
      spacingClasses.push(classes.Spacingleft);
    }
    if (this.props.spacing === "right") {
      spacingClasses.push(classes.Spacingright);
    }
    if (this.props.spacing === "top") {
      spacingClasses.push(classes.Spacingtop);
    }
    if (this.props.spacing === "bottom") {
      spacingClasses.push(classes.Spacingbottom);
    }

    const justifyContent = alignClasses.justifyContent(
      this.props.justifyContent
    );
    const alignItems = alignClasses.alignItems(this.props.alignItems);
    const alignContent = alignClasses.alignContent(this.props.alignContent);
    const alignSelf = alignClasses.alignSelf(this.props.alignSelf);

    return (
      <div
        className={[
          classes.FlexColumn,
          justifyContent,
          alignItems,
          alignContent,
          alignSelf,
          [...spacingClasses],
        ].join(" ")}
      >
        {this.props.children}
      </div>
    );
  }
}

export default FlexColumn;
