import classes from './alignFlex.module.scss';

export const justifyContent = (prop) => {
  let justify;
  switch (prop) {
    case 'flex-start':
      justify = classes.JustifyContentFlexStart;
      break;
    case 'flex-end':
      justify = classes.JustifyContentFlexEnd;
      break;
    case 'center':
      justify = classes.JustifyContentCenter;
      break;
    case 'space-between':
      justify = classes.JustifyContentSpaceBetween;
      break;
    case 'space-around':
      justify = classes.JustifyContentSpaceAround;
      break;
    case 'space-evenly':
      justify = classes.JustifyContentSpaceEvenly;
      break;
    default:
      justify = classes.JustifyContentFlexStart;
  }
  return justify;
};

export const alignItems = (prop) => {
  let alignItems;
  switch (prop) {
    case 'flex-start':
      alignItems = classes.AlignItemsFlexStart;
      break;
    case 'flex-end':
      alignItems = classes.AlignItemsFlexEnd;
      break;
    case 'center':
      alignItems = classes.AlignItemsCenter;
      break;
    case 'stretch':
      alignItems = classes.AlignItemsStretch;
      break;
    case 'baseline':
      alignItems = classes.AlignItemsBaseline;
      break;
    default:
      alignItems = classes.AlignItemsStetch;
  }
  return alignItems;
};

export const alignContent = (prop) => {
  let alignContent;
  switch (prop) {
    case 'flex-start':
      alignContent = classes.AlignContentFlexStart;
      break;
    case 'flex-end':
      alignContent = classes.AlignContentFlexEnd;
      break;
    case 'center':
      alignContent = classes.AlignContentCenter;
      break;
    case 'stretch':
      alignContent = classes.AlignContentStretch;
      break;
    case 'space-between':
      alignContent = classes.AlignContentSpaceBetween;
      break;
    case 'space-around':
      alignContent = classes.AlignContentSpaceAround;
      break;
    default:
      alignContent = classes.AlignContentStetch;
  }
  return alignContent;
};

//align self
export const alignSelf = (prop) => {
  let alignSelf;
  switch (prop) {
    case 'auto':
      alignSelf = classes.AlignSelfAuto;
      break;
    case 'flex-start':
      alignSelf = classes.AlignSelfFlexStart;
      break;
    case 'flex-end':
      alignSelf = classes.AlignSelfFlexEnd;
      break;
    case 'center':
      alignSelf = classes.AlignSelfCenter;
      break;
    case 'stretch':
      alignSelf = classes.AlignSelfStretch;
      break;
    case 'baseline':
      alignSelf = classes.AlignSelfBaseline;
      break;
    default:
      alignSelf = classes.AlignSelfAuto;
  }
  return alignSelf;
};
