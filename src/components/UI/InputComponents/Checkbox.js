import React, { PureComponent } from 'react';
import classes from './Checkbox.module.scss';

class Checkbox extends PureComponent {
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
      this.setState(prevState => {
        return { checked: this.props.checked };
      });
    }
  }

  render() {
    return (
      <div className={[classes.Checkbox, this.props.className].join(' ')}>
        <label className={classes.Container}>
          <input
            type="checkbox"
            checked={this.state.checked}
            name={this.props.name}
            onChange={event => {
              console.log('CHECKBOX onClick: ', event.target.checked);
              this.setState(prevState => {
                return { checked: !this.state.checked };
              });
              this.props.onChange(
                this.props.index,
                event.target.checked,
                event
              );
            }}
            onClick={this.props.onClick}
          />
          <span className={[classes.Checkmark].join(' ')}></span>
          {this.props.label}
        </label>
      </div>
    );
  }
}

export default Checkbox;
