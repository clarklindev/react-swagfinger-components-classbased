import React, { Component } from 'react';
import classes from './Formbuilder.module.scss';
import Spinner from '../../components/UI/Loaders/Spinner';
import Modal from '../../components/UI/Modal/Modal';
import DefaultPageLayout from '../../hoc/DefaultPageLayout/DefaultPageLayout';
import FlexRow from '../../hoc/Layout/FlexRow';
import FlexColumn from '../../hoc/Layout/FlexColumn';

import Card from '../../components/UI/Card/Card';

import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';

class Formbuilder extends Component {
  state = {
    showClipboardModal: false,
    form: [],
  };

  componentDidMount() {
    this.getComponentList();
  }

  getComponentList = () => {
    console.log('FUNCTION getComponentList');
    this.props.onFetchComponents();
  };

  render() {
    let listofcomponents = null;

    if (this.props.components !== null) {
      listofcomponents = Object.keys(this.props.components).map((each) => {
        return each;
        // return <DraggableItem style={['Embedded']}>{each}</DraggableItem>;
      });
      console.log('listofcomponents: ', listofcomponents);
    }

    return (
      <div className={classes.Formbuilder}>
        {this.props.isLoading && !this.props.activeProfile ? (
          <Spinner />
        ) : (
          <React.Fragment>
            <Modal show={this.state.showClipboardModal}>
              <FlexRow justifycontent='center'>
                <p>Copied to clipboard</p>
              </FlexRow>
            </Modal>

            {/* {listofcomponents !== null ? (
                <div className={classes.ComponentList}>
                  <div className={classes.ComponentListHeading}>
                    <Label style={{ color: 'grey' }}>Components</Label>
                  </div>
                  <div className={classes.ComponentListBody}>
                    <List value={{ data: listofcomponents }} />
                  </div>
                </div>
              ) : null} */}

            <DefaultPageLayout
              label={
                <FlexRow justifycontent='space-between'>Formbuilder</FlexRow>
              }>
              <Card style={['NoPadding']}>
                <React.Fragment>
                  <FlexColumn padding='true' spacingchildren='bottom-notlast'>
                    {/* <MultiSelect
                      name='formbuilder'
                      type='array'
                      componentconfig={{
                        defaultinputs: 0,
                        draggable: true,
                        options: [{ displaytext: '', value: '' }],
                        validation: { isRequired: true },
                      }}
                      value={[
                        {
                          data: { url: '', title: '', description: '' },
                          valid: true,
                          touched: true,
                          pristine: true,
                        },
                      ]}
                    /> */}
                    {/* <MultiInputObjects
                      name='formbuilder'
                      componentconfig={{
                        allowmultiopen: true,

                        validation: { isRequired: true },
                        defaultinputs: 0,
                        metadata: [
                          {
                            component: 'input',
                            label: 'url',
                            name: 'url',
                            placeholder: 'url',
                            type: 'string',
                            validation: { isRequired: true },
                          },
                          {
                            component: 'input',
                            label: 'title',
                            name: 'title',
                            placeholder: 'title',
                            type: 'string',
                            validation: { isRequired: true },
                          },
                          {
                            component: 'input',
                            label: 'description',
                            name: 'description',
                            placeholder: 'description',
                            type: 'string',
                            validation: { isRequired: true },
                          },
                        ],
                      }}
                      value={[
                        {
                          data: { url: '', title: '', description: '' },
                          valid: true,
                          touched: true,
                          pristine: true,
                        },
                      ]}
                    /> */}
                  </FlexColumn>
                </React.Fragment>
              </Card>
              {/* <Card style={['NoPadding']}>
                <FlexColumn padding='true' spacingchildren='bottom-notlast'>
                  <Button
                    type='WithBorder'
                    title='submit'
                    className={['FlexGrow']}>
                    Submit
                  </Button>
                </FlexColumn>
              </Card> */}
            </DefaultPageLayout>
          </React.Fragment>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    components: state.formbuilder.components,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchComponents: () => {
      dispatch(actions.processFetchComponents());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Formbuilder);
