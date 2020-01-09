import React, { Component } from 'react';
import ComponentFactory from '../../components/UI/InputComponents/ComponentFactory';
import Button from '../../components/UI/Button/Button';
import classes from './Auth.module.scss';
import * as actions from '../../store/actions/index';
import { connect } from 'react-redux';
class Auth extends Component {
  state = {
    controls: {
      email: {
        elementtype: 'input',
        elementconfig: {
          type: 'email',
          placeholder: 'Mail Address'
        },
        validation: {
          required: true,
          isEmail: true
        },
        valid: false,
        touched: false,
        value: ''
      },
      password: {
        elementtype: 'input',
        elementconfig: {
          type: 'password',
          placeholder: 'Password'
        },
        validation: {
          required: true,
          minLength: 6
        },
        valid: false,
        touched: false,
        value: ''
      }
    }
    //,isSignUp: true
  };

  checkValidity(value, rules) {
    let isValid = true;
    if (!rules) {
      return true;
    }

    if (rules.required) {
      isValid = value.trim() !== '' && isValid;
    }

    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }

    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid;
    }

    if (rules.isEmail) {
      const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      isValid = pattern.test(value) && isValid;
    }

    if (rules.isNumeric) {
      const pattern = /^\d+$/;
      isValid = pattern.test(value) && isValid;
    }

    return isValid;
  }

  inputChangedHandler = (event, controlName) => {
    const updatedControls = {
      ...this.state.controls,
      [controlName]: {
        ...this.state.controls[controlName],
        value: event.target.value,
        valid: this.checkValidity(
          event.target.value,
          this.state.controls[controlName].validation
        ),
        touched: true
      }
    };
    this.setState({ controls: updatedControls });
  };

  submitHandler = (event) => {
    event.preventDefault(); //prevents reloading of page and event bubbling
    this.props.onAuth(
      this.state.controls.email.value,
      this.state.controls.password.value,
      this.state.isSignUp
    );
  };

  switchAuthModeHandler = () => {
    this.setState((prevState) => {
      return { isSignUp: !prevState.isSignUp };
    });
  };

  render() {
    const formElementsArray = [];
    for (let key in this.state.controls) {
      formElementsArray.push({
        id: key,
        data: this.state.controls[key]
      });
    }

    const form = formElementsArray.map((item) => (
      <ComponentFactory
        key={item.id}
        id={item.id}
        data={item.data}
        changed={(event) => this.inputChangedHandler(event, item.id)}
      />
    ));

    return (
      <div className={classes.Auth}>
        <form onSubmit={this.submitHandler}>
          {form}
          <Button btnType='Success'>Submit</Button>
        </form>
        <Button btnType='Danger' onClick={this.switchAuthModeHandler}>
          Switch to {this.state.isSignUp ? 'SIGN-IN' : 'SIGN-UP'}
        </Button>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (email, password, isSignup) =>
      dispatch(actions.auth(email, password, isSignup))
  };
};
export default connect(null, mapDispatchToProps)(Auth);
