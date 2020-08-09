import React, { Component } from 'react';
import ComponentFactory from '../../components/UI/InputComponents/ComponentFactory';
import ListItem from '../../components/UI/InputComponents/ListItem';
import Button from '../../components/UI/Button/Button';
import Icon from '../../components/UI/InputComponents/Icon';
//styling
import buttonStyle from '../../components/UI/Button/Button.module.scss';
import { connect } from 'react-redux';
import * as align from '../../shared/alignFlex.module.scss';
import FlexRow from '../../hoc/Layout/FlexRow';

class ProfileReadProfile extends Component {
  getClipboardButton = (whatToCopy) => {
    return (
      <Button
        className={buttonStyle.NoStyle}
        title='copy to clipboard'
        onClick={(event) => this.props.onClick(event, whatToCopy)}>
        <Icon iconstyle='far' code='clipboard' size='sm' />
      </Button>
    );
  };

  render() {
    console.log('activeProfile: ', this.props.activeProfile);

    return (
      <React.Fragment>
        <ComponentFactory
          data={{
            label: 'Name',
            component: 'raw',
            value: (
              <ListItem align={align.JustifyContentSpaceBetween}>
                <FlexRow justifyContent='space-between' flexgrow='true'>
                  {this.props.activeProfile['name']}
                  {this.getClipboardButton(this.props.activeProfile['name'])}
                </FlexRow>
              </ListItem>
            ),
          }}
        />

        <ComponentFactory
          data={{
            label: 'Last name',
            component: 'raw',
            value: (
              <ListItem align={align.JustifyContentSpaceBetween}>
                <FlexRow justifyContent='space-between' flexgrow='true'>
                  {this.props.activeProfile['lastname']}
                  {this.getClipboardButton(
                    this.props.activeProfile['lastname']
                  )}
                </FlexRow>
              </ListItem>
            ),
          }}
        />

        <ComponentFactory
          data={{
            label: 'Contact number',
            component: 'list',
            value: {
              data: this.props.activeProfile['contactnumbers'].map(
                (each, index) => {
                  return (
                    <ListItem align={align.JustifyContentSpaceBetween}>
                      <FlexRow justifyContent='space-between' flexgrow='true'>
                        {each}
                        {this.getClipboardButton(each)}
                      </FlexRow>
                    </ListItem>
                  );
                }
              ),
            },
          }}
        />

        <ComponentFactory
          data={{
            label: 'Email',
            component: 'list',
            value: {
              data: this.props.activeProfile['emails'].map((each, index) => {
                return (
                  <ListItem align={align.JustifyContentSpaceBetween}>
                    <FlexRow justifyContent='space-between' flexgrow='true'>
                      {each}
                      {this.getClipboardButton(each)}
                    </FlexRow>
                  </ListItem>
                );
              }),
            },
          }}
        />

        <ComponentFactory
          data={{
            label: 'Contact Preference',
            component: 'raw',
            value: (
              <ListItem align={align.JustifyContentSpaceBetween}>
                <FlexRow justifyContent='space-between' flexgrow='true'>
                  {this.props.activeProfile['contactpreference']}
                  {this.getClipboardButton(
                    this.props.activeProfile['contactpreference']
                  )}
                </FlexRow>
              </ListItem>
            ),
          }}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    activeProfile: state.profile.activeProfile,
  };
};

export default connect(mapStateToProps, null)(ProfileReadProfile);
