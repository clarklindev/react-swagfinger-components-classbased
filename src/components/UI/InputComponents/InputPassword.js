import React, { Component } from 'react';
import InputWithIcon from './InputWithIcon';

class InputPassword extends Component {
  state = {
    showPassword: false,
  };

  togglePasswordVisibility = () => {
    console.log('togglePasswordVisibility');

    //toggle showPassword
    this.setState((prevState) => {
      return {
        showPassword: !prevState.showPassword,
      };
    });
  };

  render() {
    const passwordConfig = {
      componentconfig: {
        hasdivider: true,
        iconclick: () => this.togglePasswordVisibility,
        iconcode: this.state.showPassword ? 'eye-slash' : 'eye',
        type: this.state.showPassword ? 'text' : 'password',
        iconposition: 'right',
        iconsize: 'sm',
        iconstyle: 'fas',
      },
    };
    return <InputWithIcon {...this.props} {...passwordConfig}></InputWithIcon>;
  }
}

export default InputPassword;
