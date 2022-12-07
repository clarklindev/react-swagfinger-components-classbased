import React, { Component } from 'react';
import classes from './ProfileRead.module.scss';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';

import DefaultPageLayout from '../../hoc/DefaultPageLayout/DefaultPageLayout';
import Spinner from '../../components/UI/Loaders/Spinner';
import Card from '../../components/UI/Card/Card';
import Modal from '../../components/UI/Modal/Modal';
import Tabs from '../../components/UI/Tabs/Tabs';
import * as Clipboard from '../../shared/clipboardHelper';

//tabs
import ProfileReadTimeline from './ProfileReadTimeline';
import ProfileReadProfile from './ProfileReadProfile';

class ProfileRead extends Component {
  async componentDidMount() {
    //hide the toolbar
    this.props.hideToolbar(true);
    this.getProfile();
  }

  state = {
    activeTab: 'profile',
    showClipboardModal: false
  };

  getProfile = () => {
    const query = new URLSearchParams(this.props.location.search);
    // //get id in url query params
    const id = query.get('id');
    if (id) {
      this.props.onFetchProfile(id);
    }
  };

  tabClickHandler = (clicked) => {
    this.setState({ activeTab: clicked });
  };

  copyToClipboard = (event, whatToCopy) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('Copy to clipboard');
    Clipboard.copyStringToClipboard(whatToCopy);
    this.setState({ showClipboardModal: true });
    setTimeout(() => {
      this.setState({ showClipboardModal: false });
    }, 1000);
  };

  render() {
    let data = null;
    if (this.props.activeProfile) {
      switch (this.state.activeTab) {
        case 'profile':
          data = <ProfileReadProfile onClick={this.copyToClipboard} />;
          break;
        case 'timeline':
          data = <ProfileReadTimeline />;
          break;
        default:
          data = undefined;
      }
    }

    return (
      <div className={classes.ProfileRead}>
        {this.props.isLoading && !this.props.activeProfile ? (
          <Spinner />
        ) : (
          <React.Fragment>
            <Modal show={this.state.showClipboardModal}>
              <div
                style={{ display: 'flex', flexDirection: 'row' }}
                justifycontent="center"
              >
                <p>Copied to clipboard</p>
              </div>
            </Modal>
            {this.props.activeProfile ? (
              <DefaultPageLayout
                label={`${this.props.activeProfile['name']} ${this.props.activeProfile['lastname']}`}
              >
                <Tabs
                  tabheaders={['profile', 'timeline']}
                  onClick={this.tabClickHandler}
                />
                <Card style={['Padding']}>{data}</Card>
              </DefaultPageLayout>
            ) : null}
          </React.Fragment>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    storedPhonebook: state.profile.phoneBook,
    isLoading: state.profile.loading,
    activeProfile: state.profile.activeProfile
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchProfile: (id) => {
      dispatch(actions.processFetchProfile(id));
    },

    hideToolbar: (bool) => {
      dispatch(actions.hasToolbar(bool));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileRead);
