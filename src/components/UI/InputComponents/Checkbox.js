import React, { Component } from 'react';
import classes from './Checkbox.module.scss';

class Checkbox extends Component {
  constructor(props) {
    super(props);

    this.checkboxRef = React.createRef();
  }

  state = {
    checked: this.props.checked
  };

  componentDidMount() {
    this.setState({ checked: this.props.checked });
  }

  componentDidUpdate() {
    if (this.state.checked !== this.props.checked) {
      //console.log('COMPONENT DID UPDATE');
      this.setState({ checked: this.props.checked });
      this.checkboxRef.current.checked = this.props.checked;
    }

    if (this.props.indeterminate === true) {
      this.checkboxRef.current.indeterminate = true;
    } else {
      this.checkboxRef.current.indeterminate = null;
    }
  }

  render() {
    return (
      <div className={[classes.Checkbox, this.props.className].join(' ')}>
        <label className={classes.Container}>
          <input
            type="checkbox"
            defaultChecked={this.state.checked}
            name={this.props.name}
            ref={this.checkboxRef}
            onChange={event => {
              this.props.onChange(this.props.index, event.target.checked);
            }}
          />
          {/* {this.checkboxRef.current.indeterminate ? (
            <span className={[classes.Intermediate].join(' ')}></span>
          ) : (
            <span className={[classes.Checkmark].join(' ')}></span>
          )} */}

          {this.props.indeterminate === true ? (
            <span className={[classes.Indeterminate].join(' ')}></span>
          ) : (
            <span className={[classes.Checkmark].join(' ')}></span>
          )}

          {this.props.label}
        </label>
      </div>
    );
  }
}

export default Checkbox;
