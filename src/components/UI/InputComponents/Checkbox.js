import React, { Component } from 'react';
import classes from './Checkbox.module.scss';

class Checkbox extends Component {
  state = {
    checked: null
  };

  componentDidMount() {
    this.setState({ checked: this.props.checked });
  }

  componentDidUpdate() {
    console.log(
      'CHECKBOX componentDidUpdate:',
      this.state.checked,
      this.props.checked
    );
    if (this.state.checked !== this.props.checked) {
      console.log('DIFF VALUES...', this.state.checked, this.props.checked);
      this.setState({ checked: this.props.checked });
    }
  }

  render() {
    return (
      <div className={[classes.Checkbox, this.props.className].join(' ')}>
        <label className={classes.Container}>
          <input
            type='checkbox'
            defaultChecked={this.state.checked}
            name={this.props.name}
            onClick={(event) => {
              const target = event.target;
              console.log('CHECKBOX onClick: ', target.checked);
              this.props.onChange(this.props.index, target.checked, event);
              this.setState({ checked: target.checked ? true : false });
            }}
          />
          <span className={[classes.Checkmark].join(' ')}></span>
          {this.props.label}
        </label>
      </div>
    );
  }
}

export default Checkbox;
