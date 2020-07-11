import React, { Component } from 'react';
import InputWithIcon from './InputWithIcon';
import Button from '../Button/Button';
import Icon from './Icon';
import InputContext from '../../../context/InputContext';

class InputSearch extends Component {
  static contextType = InputContext;

  onClickHandler = (event) => {
    this.context.clear();
  };

  render() {
    const searchConfig = {
      componentconfig: {
        placeholder: 'Enter your search',
        hasdivider: true,
        iconcode: 'search',
        type: 'search',
        iconposition: 'left',
        iconsize: 'sm',
        iconstyle: 'fas',
      },
      name: 'search',
      label: 'Search',
      value: {
        data: this.props.value,
        valid: false,
        touched: false,
        pristine: true,
        errors: null,
      },
    };

    const searchclose = (
      <Button type='NoStyle' onClick={this.onClickHandler.bind(this)}>
        <Icon
          iconstyle='fas'
          code='times'
          size={searchConfig.componentconfig.iconsize}
        />
      </Button>
    );

    return (
      <React.Fragment>
        <InputWithIcon
          {...searchConfig}
          clearSearch={searchclose}></InputWithIcon>
      </React.Fragment>
    );
  }
}

export default InputSearch;
