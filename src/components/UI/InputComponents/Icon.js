import React, { Component } from "react";
import classes from "./Icon.module.scss";
// font awesome
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMinus,
  faBars,
  faTimes,
  faChevronUp,
  faChevronLeft,
  faChevronRight,
  faChevronDown,
  faSearch,
  faExclamationCircle,
  faArrowCircleUp,
  faCloudUploadAlt,
  faCheck,
  faEye,
  faEyeSlash,
  faFolderPlus,
  faEllipsisH,
  faEdit as faEditSolid,
  faLevelUpAlt,
  faDownload,
  faLink,
  faExternalLinkAlt,
  faGripVertical,
} from "@fortawesome/free-solid-svg-icons";
import {
  faEdit,
  faTrashAlt as farFaTrashAlt,
  faCalendarAlt,
  faFolder,
  faFile,
  faCopy, //copy
  faClipboard, //clipboard
} from "@fortawesome/free-regular-svg-icons";

import Utils from "../../../Utils";
//add to fontawesome lib so we can reuse icons
library.add(
  faChevronLeft,
  faChevronRight,
  faEdit,
  faEditSolid,
  faTimes, //close
  farFaTrashAlt, //delete
  faPlus,
  faMinus,
  faBars, //show side menu
  faCalendarAlt, //date picker
  faChevronUp,
  faChevronDown,
  faSearch, //magnifying glass
  faExclamationCircle, //input error
  faArrowCircleUp, //uploaded
  faCloudUploadAlt, //upload
  faCheck, //check icon
  faEye,
  faEyeSlash, //show/hide password
  faFolder, //normal folder icon
  faFolderPlus,
  faFile, //file,
  faEllipsisH, //ellipsis
  faLevelUpAlt, //navigate one folder up
  faDownload, //download
  faCopy, //copy
  faLink, // link/url
  faClipboard, //clipboard
  faExternalLinkAlt, //external link
  faGripVertical //draggable
);

class Icon extends Component {
  render() {
    let classList = Utils.getClassNameString([
      classes.Icon,
      Icon.name,
      classes[this.props.type],
      classes[this.props.px],
      this.props.className,
    ]);

    return (
      <div
        className={[classList].join(" ")}
        style={{
          width: this.props.width ? this.props.width : "auto",
          height: this.props.height ? this.props.height : "auto",
        }}
      >
        <FontAwesomeIcon
          icon={[this.props.iconstyle, this.props.code]}
          size={this.props.size} //xs, sm, lg, 2x,3x,4x,5x,6x,7x,8x,9x,10x
          flip={this.props.flip}
          fixedWidth={true}
        />
      </div>
    );
  }
}

export default Icon;
