import React, { Component } from 'react';
import classes from './Formbuilder.module.scss';
import Spinner from '../../components/UI/Loaders/Spinner';
import Modal from '../../components/UI/Modal/Modal';
import DefaultPageLayout from '../../hoc/DefaultPageLayout/DefaultPageLayout';
import FlexRow from '../../hoc/Layout/FlexRow';
import FlexColumn from '../../hoc/Layout/FlexColumn';

import Card from '../../components/UI/Card/Card';
import Label from '../../components/UI/Headers/Label';
import List from '../../components/UI/InputComponents/List';
import ListItem from '../../components/UI/InputComponents/ListItem';
import DraggableItem from '../../components/UI/InputComponents/DraggableItem';
import Button from '../../components/UI/Button/Button';
import Icon from '../../components/UI/InputComponents/Icon';
import Separator from '../../components/UI/Separator/Separator';

import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';

class Formbuilder extends Component {
  state = {
    showClipboardModal: false,
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
        return <DraggableItem style={['Embedded']}>{each}</DraggableItem>;
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
              <FlexRow justifyContent='center'>
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
                <FlexRow justifyContent='space-between'>Formbuilder</FlexRow>
              }>
              <Card style={['NoPadding']}>
                <FlexColumn spacingchildren='bottom-notlast' padding='true'>
                  <Button
                    title='Add'
                    type='WithBorder'
                    className='FlexGrow'
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      // this.context.addinput(this.props.type, this.props.name, {
                      //   key: '',
                      //   value: '',
                      // });
                    }}>
                    <Icon iconstyle='fas' code='plus' size='sm' />
                    <p>Add form element</p>
                  </Button>
                </FlexColumn>
                <Separator
                  direction='horizontal'
                  style={['Dotted', 'Padding']}
                />
                <FlexColumn spacingchildren='bottom-notlast' padding='true'>
                  <Button
                    type='WithBorder'
                    title='submit'
                    className={['FlexGrow']}>
                    Submit
                  </Button>
                </FlexColumn>
              </Card>
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
