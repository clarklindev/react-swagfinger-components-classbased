import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import classes from './Login.module.scss';
import axiosInstance from '../../axios-profiles';

import * as actions from '../../store/actions/index';
import Button from '../../components/UI/Button/Button';
import ComponentFactory from '../../components/UI/InputComponents/ComponentFactory';
import InputContext from '../../context/InputContext';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Spinner from '../../components/UI/Loaders/Spinner';
import DefaultPageLayout from '../../hoc/DefaultPageLayout/DefaultPageLayout';
import { CheckValidity as validationCheck } from '../../shared/validation';
import Card from '../../components/UI/Card/Card';

class Login extends Component {
  constructor(props) {
    super(props);
    this.submitInputRef = React.createRef();
    this.submitButtonRef = React.createRef();
  }

  state = {
    isSignUp: false,
    isPasswordVisible: false,
    form: null,
    loginSchema: null,
  };
  //------------------------------------------------------
  //------------------------------------------------------
  componentDidMount() {
    this.props.onFetchLoginSchema(); //load the login form schema
    window.addEventListener('keydown', this.keyListener);
  }

  componentDidUpdate() {
    if (this.props.loginSchema !== this.state.loginSchema) {
      console.log('props.loginSchema: ', this.props.loginSchema);
      this.createForm(this.props.loginSchema);
    }
    if (this.props.error !== null) {
      console.log('error: ', this.props.error);
    }
  }

  createForm = (schema) => {
    const obj = {};

    schema.forEach((item) => {
      obj[item.name] = item;
      obj[item.name].value = {
        data: '',
        touched: false,
        pristine: true,
        valid: false,
        errors: false,
      };
    });
    console.log('form:', obj);

    this.setState({ loginSchema: schema, form: obj });
  };

  componentWillUnmount() {
    window.removeEventListener('keydown', this.keyListener);
  }

  keyListener = (event) => {
    if (event.key === 'Enter' || event.keyCode === 13 || event.which === 13) {
      console.log('key: ', event.key);
      this.onSubmitHandler(event);
    }
  };

  //------------------------------------------------------
  //------------------------------------------------------
  //checks the .valid property of each input in array or individual input
  //returns true/false if form object is valid/invalid
  // checkInputValidProperty = (form) => {
  //   // console.log('IS FORM VALID CHECK');
  //   let formIsValid = true;

  //   //each prop in contact
  //   for (let inputIdentifier in form) {
  //     formIsValid = form[inputIdentifier].value.valid && formIsValid;
  //   }

  //   return formIsValid;
  // };

  //------------------------------------------------------
  //------------------------------------------------------
  inputChangedHandler = (type, inputIdentifier, newval) => {
    console.log('type: ', type);
    console.log('inputIdentifier:', inputIdentifier);
    console.log('newval: ', newval);

    let validation;

    if (
      this.state.form[inputIdentifier].componentconfig.validation !== undefined
    ) {
      validation = validationCheck(
        newval,
        this.state.form[inputIdentifier].componentconfig.validation
      );
    }

    this.setState((prevState) => {
      return {
        form: {
          ...prevState.form,
          [inputIdentifier]: {
            ...prevState.form[inputIdentifier],
            value: {
              data: newval,
              touched: true,
              pristine: false,
              valid: this.state.form[inputIdentifier].componentconfig.validation
                ? validation.isValid
                : true,
              errors: this.state.form[inputIdentifier].componentconfig
                .validation
                ? validation.errors
                : [],
            },
          },
        },
      };
    });
  };

  onSubmitHandler = (event) => {
    event.preventDefault(); //prevents reloading of page
    this.props.onAuth(
      this.state.form.login.value.data,
      this.state.form.password.value.data,
      this.state.isSignUp
    );
  };

  switchAuthModeHandler = (event) => {
    event.preventDefault();
    console.log('switchAuthModeHandler!');

    this.setState((prevState) => {
      return {
        isSignUp: !prevState.isSignUp,
        form: {
          ...prevState.form,
          login: {
            ...prevState.form.login,
            value: { ...prevState.form.login.value, data: '' },
          },
          password: {
            ...prevState.form.password,
            value: { ...prevState.form.password.value, data: '' },
          },
        },
      };
    });
  };

  render() {
    let inputs;
    if (this.state.form !== null) {
      inputs = Object.keys(this.state.form).map((key) => {
        console.log('key:', key, ' data: ', this.state.form[key]);
        return <ComponentFactory key={key} data={this.state.form[key]} />;
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
                changed: this.inputChangedHandler,
              }}>
              {inputs}
              <div className={classes.ButtonWrapper}>
                <input ref={this.submitInputRef} type='submit' />

                <Button
                  reference={this.submitButtonRef}
                  type='Action'
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
      content = <div className={classes.Login}>{formAll}</div>;
    }
    return content;
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    loginSchema: state.auth.loginSchema,
    isAuthenticated: state.auth.token !== null,
    authRedirectPath: state.auth.authRedirectPath,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (email, password, isSignup) => {
      return dispatch(actions.auth(email, password, isSignup));
    },

    onFetchLoginSchema: () => {
      return dispatch(actions.fetchLoginSchema());
    },
    // onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/')),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(Login, axiosInstance));
