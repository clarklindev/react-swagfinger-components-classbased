import React, { Component } from 'react';
import Modal from '../../components/UI/Modal/Modal';

const withErrorHandler = (WrappedComponent, axios) => {
  return class extends Component {
    state = {
      error: null
    };

    componentDidMount() {
      this.reqInterceptor = axios.interceptors.request.use((req) => {
        this.setState({ error: null });
        return req;
      });
      this.resInterceptor = axios.interceptors.response.use(
        (res) => res,
        (error) => {
          this.setState({ error: error });
        }
      );
    }

    componentWillUnmount() {
      axios.interceptors.request.eject(this.reqInterceptor);
      axios.interceptors.response.eject(this.resInterceptor);
    }

    errorConfirmedHandler = () => {
      this.setState({ error: null });
    };

    render() {
      let errorMessage = null;
      if (this.state.error) {
        switch (this.state.error.response.data.error.message) {
          case 'INVALID_EMAIL':
            errorMessage = 'Invalid email';
            break;
          case 'EMAIL_NOT_FOUND':
            errorMessage = 'Email not found';
            break;
          case 'EMAIL_EXISTS':
            errorMessage =
              'The email address is already in use by another account.';
            break;
          case 'MISSING_PASSWORD':
            errorMessage = 'Missing password';
            break;
          case 'INVALID_PASSWORD':
            errorMessage = 'Password is invalid';
            break;
          case 'TOO_MANY_ATTEMPTS_TRY_LATER':
            errorMessage =
              'Too many unsuccessful login attempts. Please try again later.';
            break;
          default:
            errorMessage = this.state.error.response.data.error.message;
            break;
        }
      }
      return (
        <React.Fragment>
          <Modal
            label='Error'
            show={this.state.error}
            size='LayoutNarrow'
            modalClosed={this.errorConfirmedHandler}>
            {this.state.error
              ? /* https://firebase.google.com/docs/reference/rest/auth#section-error-format */
                errorMessage
              : null}
          </Modal>
          <WrappedComponent {...this.props} />
        </React.Fragment>
      );
    }
  };
};

export default withErrorHandler;
