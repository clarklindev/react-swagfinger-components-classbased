import React from 'react';

const inputContext = React.createContext({
  addinput: () => {},
  removeinput: () => {},
  changed: () => {},
  togglepasswordvisibility: () => {},
  submitTest: false
});

export default inputContext;
