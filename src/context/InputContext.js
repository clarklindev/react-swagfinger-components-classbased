import React from 'react';

const inputContext = React.createContext({
  addinput: () => {},
  removeinput: () => {},
  changed: () => {},
  replacearray: () => {},
  removeidarray: () => {},
  togglepasswordvisibility: () => {},
  submitTest: false,
});

export default inputContext;
