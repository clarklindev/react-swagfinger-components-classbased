import * as actionTypes from './actionsTypes';

//toolbar
export const hasToolbar = (hastoolbar) => {
  return { type: actionTypes.SHOW_TOOLBAR, show: hastoolbar };
};
