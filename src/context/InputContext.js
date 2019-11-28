import React from 'react';

const inputContext = React.createContext({
  addinput: () => {},
  removeinput: () => {},
  changed: () => {},
  submitTest: false
});

export default inputContext;
