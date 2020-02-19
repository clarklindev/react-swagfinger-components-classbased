import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import classes from './Auth.module.scss';
import axios from 'axios';

import * as actions from '../../store/actions/index';
import Button from '../../components/UI/Button/Button';
import ComponentFactory from '../../components/UI/InputComponents/ComponentFactory';
import InputContext from '../../context/InputContext';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Spinner from '../../components/UI/Loaders/Spinner';
import DefaultPageLayout from '../../hoc/DefaultPageLayout/DefaultPageLayout';
import { CheckValidity as validationCheck } from '../../shared/validation';
import Card from '../../components/UI/Card/Card';

class Auth extends Component {
  constructor(props) {
    super(props);
    this.submitInputRef = React.createRef();
  }
  state = {
    form: {
      email: {
        component: 'input',
        name: 'email',
        label: 'Email',
        elementconfig: {
          type: 'text',
          placeholder: 'Mail Address'
        },
        value: {
          data: '',
          valid: false,
          touched: false,
          pristine: true,
          errors: null
        }
      },
      password: {
        component: 'input',
        name: 'password',
        label: 'Password',
        elementconfig: {
          type: 'password',
          placeholder: 'Password'
        },
        value: {
          data: '',
          valid: false,
          touched: false,
          pristine: true,
          errors: null
        }
      }
    },
    formIsValid: false,
    isSignUp: false
  };
  //------------------------------------------------------
  //------------------------------------------------------
  // componentDidMount() {
  //   //check we reset path if not busy before authenticate
  //   // if (
  //   //   /*!this.props.buildingBurger && */ this.props.authRedirectPath !== '/'
  //   // ) {
  //   //   this.props.onSetAuthRedirectPath(); //always passes /
  //   // }
  // }

  //------------------------------------------------------
  //------------------------------------------------------
  //checks the .valid property of each input in array or individual input
  //returns true/false if form object is valid/invalid
  checkInputValidProperty = (form) => {
    // console.log('IS FORM VALID CHECK');
    let formIsValid = true;

    //each prop in contact
    for (let inputIdentifier in form) {
      //if the prop of contact has an element type of...
      if (form[inputIdentifier].elementconfig.valuetype === 'array') {
        for (let each of form[inputIdentifier].value) {
          formIsValid = each.valid && formIsValid;
        }
      } else {
        formIsValid = form[inputIdentifier].value.valid && formIsValid;
      }
    }

    return formIsValid;
  };

  //------------------------------------------------------
  //------------------------------------------------------
  inputChangedHandler = (newval, inputIdentifier, index = null) => {
    // console.log('inputChangedHandler: ', inputIdentifier);
    //single contact
    const updatedForm = {
      ...this.state.form
    };

    //single prop of form
    const updatedFormElement = {
      ...updatedForm[inputIdentifier]
    };

    let validation = validationCheck(newval, updatedFormElement.validation);
    //if array
    if (index !== null) {
      updatedFormElement.value[index].data = newval;
      updatedFormElement.value[index].touched = true;
      updatedFormElement.value[index].pristine = false;
      updatedFormElement.value[index].valid = validation.isValid;
      updatedFormElement.value[index].errors = validation.errors;
    } else {
      //if single value
      updatedFormElement.value.data = newval;
      updatedFormElement.value.touched = true;
      updatedFormElement.value.pristine = false;
      updatedFormElement.value.valid = validation.isValid;
      updatedFormElement.value.errors = validation.errors;
    }

    updatedForm[inputIdentifier] = updatedFormElement; //update form's input element state as that or 'updatedFormElement'

    const formValidCheck = this.checkInputValidProperty(updatedForm);
    // console.log('FORM VALIDITY: ', formValidCheck);
    this.setState({ form: updatedForm, formIsValid: formValidCheck });
  };

  onSubmitHandler = (event) => {
    event.preventDefault(); //prevents reloading of page
    this.props.onAuth(
      this.state.form.email.value.data,
      this.state.form.password.value.data,
      this.state.isSignUp
    );
  };

  switchAuthModeHandler = (event) => {
    event.preventDefault();
    console.log('switchAuthModeHandler!');
    this.setState((prevState) => {
      return { isSignUp: !prevState.isSignUp };
    });
  };

  render() {
    const formElementsArray = [];
    for (let key in this.state.form) {
      formElementsArray.push({
        id: key,
        data: this.state.form[key]
      });
    }

    let formAll = (
      <DefaultPageLayout
        type='LayoutNarrow'
        label={
          this.props.loading ? '' : this.state.isSignUp ? 'Sign-up' : 'Login'
        }>
        <Card className='Card'>
          <form onSubmit={this.onSubmitHandler} autoComplete='off'>
            <InputContext.Provider
              value={{
                changed: this.inputChangedHandler
              }}>
              {formElementsArray.map((item) => (
                <ComponentFactory key={item.id} id={item.id} data={item.data} />
              ))}
              <div className={classes.ButtonWrapper}>
                <input ref={this.submitInputRef} type='submit' />

                <Button
                  type='Login'
                  onClick={() => {
                    this.submitInputRef.current.click();
                  }}>
                  Submit
                </Button>
              </div>
            </InputContext.Provider>
          </form>
        </Card>
        <Card className={'Card'}>
          <div className={classes.FlexGroupRow}>
            {this.state.isSignUp
              ? `Have an account? `
              : `Don't have an account? `}
            <Button
              className={classes.SwitchButton}
              type='WithPadding'
              onClick={this.switchAuthModeHandler}>
              <span className={classes.ButtonText}>
                {this.state.isSignUp ? 'Login' : 'Sign-up'}
              </span>
            </Button>
          </div>
        </Card>
      </DefaultPageLayout>
    );

    if (this.props.loading) {
      formAll = <Spinner />;
    }

    let content = null;
    if (this.props.isAuthenticated) {
      content = <Redirect to={this.props.authRedirectPath} />;
    } else {
      content = <div className={classes.Auth}>{formAll}</div>;
    }
    return content;
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.token !== null,
    authRedirectPath: state.auth.authRedirectPath
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (email, password, isSignup) =>
      dispatch(actions.auth(email, password, isSignup)),
    onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(Auth, axios));
