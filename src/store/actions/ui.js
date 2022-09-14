import * as actionTypes from './actionsTypes';

//toolbar
export const hasToolbar = (hastoolbar) => {
  return { type: actionTypes.UI_SHOW_TOOLBAR, show: hastoolbar };
};
