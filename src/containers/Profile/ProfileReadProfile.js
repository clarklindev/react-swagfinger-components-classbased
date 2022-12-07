import React, { Component } from 'react';
import ComponentFactory from '../../components/UI/InputComponents/ComponentFactory';
import ListItem from '../../components/UI/InputComponents/ListItem';
import Button from '../../components/UI/Button/Button';
import Icon from '../../components/UI/Icon/Icon';
//styling
import buttonStyle from '../../components/UI/Button/Button.module.scss';
import { connect } from 'react-redux';

class ProfileReadProfile extends Component {
  getClipboardButton = (whatToCopy) => {
    return (
      <Button
        className={buttonStyle.NoStyle}
        title="copy to clipboard"
        onClick={(event) => this.props.onClick(event, whatToCopy)}
      >
        <Icon iconstyle="far" code="copy" size="sm" />
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
              <ListItem
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    flexGrow: 1
                  }}
                >
                  {this.props.activeProfile['name']}
                  {this.getClipboardButton(this.props.activeProfile['name'])}
                </div>
              </ListItem>
            )
          }}
        />

        <ComponentFactory
          data={{
            label: 'Last name',
            component: 'raw',
            value: (
              <ListItem
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    flexGrow: 1
                  }}
                >
                  {this.props.activeProfile['lastname']}
                  {this.getClipboardButton(
                    this.props.activeProfile['lastname']
                  )}
                </div>
              </ListItem>
            )
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
                    <ListItem
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          flexGrow: 1,
                          justifyContent: 'space-between'
                        }}
                      >
                        {each}
                        {this.getClipboardButton(each)}
                      </div>
                    </ListItem>
                  );
                }
              )
            }
          }}
        />

        <ComponentFactory
          data={{
            label: 'Email',
            component: 'list',
            value: {
              data: this.props.activeProfile['emails'].map((each, index) => {
                return (
                  <ListItem
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        flexGrow: 1
                      }}
                    >
                      {each}
                      {this.getClipboardButton(each)}
                    </div>
                  </ListItem>
                );
              })
            }
          }}
        />

        <ComponentFactory
          data={{
            label: 'Contact Preference',
            component: 'raw',
            value: (
              <ListItem
                style={{
                  display: 'flex',
                  flexDirection: 'row'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    flexGrow: 1
                  }}
                >
                  {this.props.activeProfile['contactpreference']}
                  {this.getClipboardButton(
                    this.props.activeProfile['contactpreference']
                  )}
                </div>
              </ListItem>
            )
          }}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    activeProfile: state.profile.activeProfile
  };
};

export default connect(mapStateToProps, null)(ProfileReadProfile);
