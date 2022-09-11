import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import classes from './Formbuilder.module.scss';

//Helper classes
import axios from '../../axios-firebase';
import * as actions from '../../store/actions/forms';//redux store
import InputContext from '../../context/InputContext';//context

//hoc
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import DefaultPageLayout from '../../hoc/DefaultPageLayout/DefaultPageLayout';

//components
import Card from '../../components/UI/Card/Card';
import Modal from '../../components/UI/Modal/Modal';
import Icon from '../../components/UI/Icon/Icon';
import MultiInputObjects from '../../components/UI/InputComponents/MultiInputObjects';
import Label from '../../components/UI/Headers/Label';
import Select from '../../components/UI/InputComponents/Select';
import Input from '../../components/UI/InputComponents/Input';
import Button from '../../components/UI/Button/Button';
import Separator from '../../components/UI/Separator/Separator';
import FlexResponsive from '../../hoc/Layout/FlexResponsive';
import FlexColumn from '../../hoc/Layout/FlexColumn';
// import ComponentFactory from '../../components/UI/InputComponents/ComponentFactory';
// import Spinner from '../../components/UI/Loaders/Spinner';
// import FlexRow from '../../hoc/Layout/FlexRow';

class Formbuilder extends PureComponent {
  constructor(props) {
    super(props);

    //reference
    this.submitInputRef = React.createRef();
  }

  state = {
    schemaPath: '',
    formIsValid: null, //for form validation,
    loadOrCreateSelected: false,
    
    //modal related
    createNewFormModalIsOpen: false,
    nameValid: null,
    newFormName: '',
    errorModalMessage: null
  };
  //------------------------------------------------------
  //------------------------------------------------------
  //pull data from firebase, generated form is dependant on whats inside the database in firebase
  //key in database needs to exist to be associated with state,
  componentDidMount() {
    //console.log('Function componentDidMount - Formbuilder');
    this.props.onFetchSchema(this.props.schemaListPath);
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('FUNCTION componentDidUpdate - Formbuilder');
    const query = this.props.location.search;
    const prevQuery = prevProps.location.search;
    //const paramvalue = query.get('name'); //get from url query param 'id'
    console.log('query: ', query);
    console.log('prevQuery: ', prevQuery);

    if(query!=="" && this.state.loadOrCreateSelected === false){ //state has already set 'newFormName' when selection made
      this.setState({loadOrCreateSelected:true}); 
      //get new schema from url querystring
    }       
  }

  redirect = () => {
    this.props.history.push('/phonebookadmin');
  };

  //------------------------------------------------------
  //------------------------------------------------------

  showCreateModal = () => {
    this.setState({ createNewFormModalIsOpen: true, newFormName:'' });
    // this.props.history.push({
    //   pathname: `/formbuilder`
    // });
  };

  //checks if new form name is valid..
  checkAvailability = (event) => {
    console.log('FUNCTION checkAvailability');
    console.log('event.target.value: ', event.target.value);
    //go through data source (this.props.formlist) and get check if it exists,
    let isFound;
    if(this.props.formlist !== null){
      console.log("this.props.formlist: ", this.props.formlist);
      isFound = Object.keys(this.props.formlist).find(item=>{
        return item === event.target.value;
      })
      if(isFound){
        console.log('ITEM ALREADY EXISTS');
        this.setState({nameValid: false, newFormName: event.target.value, errorModalMessage:['already exists']})
      }
      else{
        console.log('NEW ITEM NAME: ', event.target.value);
        this.setState({nameValid: true,  newFormName: event.target.value, errorModalMessage:[]});
      }
    }
  };

  //function gets called when selection changes
  loadSelected = (event) =>{
    console.log('e.target.value:', event.target.value);
    this.setState({newFormName: event.target.value});
    this.addNameQueryParamToUrl(event.target.value);
  }

  addNameQueryParamToUrl = (value)=>{
    this.setState({createNewFormModalIsOpen: false, loadOrCreateSelected:true})
    this.props.history.push({
      pathname: `/formbuilder`,
      search: `?name=${value}`,
    });
  }

  modalClosedHandler = async () => {
    await this.setState((prevState) => {
      console.log(
        `\t%cSETSTATE: createFolderModal: ${false}`,
        'background:yellow; color:red'
      );
      return { 
        createNewFormModalIsOpen: false,
        newFormName: '',
        nameValid: null,
        errorModalMessage: null };
    });
  }

  render() {
    
    const selectOptions = (this.props.formlist[this.props.schemaListPath] !== undefined) ?
      Object.keys(this.props.formlist[this.props.schemaListPath]).map(item=>{
        return {
          value: item,
          displaytext: item,
        };
      }):[];

    const existsInSelection = selectOptions.find(item=>{
      return item.value === this.state.newFormName
    });

    const selectLoadOrNew = (
      <FlexResponsive>
        <FlexColumn padding='true' flexgrow='true'>
          <Label>Select</Label>
            <Select
              componentconfig={{
                options: selectOptions
              }}
              value={{data:existsInSelection === undefined? '': existsInSelection.value}}
              onChange={this.loadSelected}
            />
        </FlexColumn>
        <Separator class='Solid' padding='true' direction="Vertical">OR</Separator>
        <FlexColumn padding='true'>
          <Label>Create</Label>
          <Button
            type='WithBorder'
            className='FlexGrow'
            title='Add'
            onClick={this.showCreateModal}>
            <Icon iconstyle='fas' code='plus' size='sm' />
            <p>new form</p>
          </Button>
        </FlexColumn>
      </FlexResponsive>
    );
    
    const formBuilding = (
      <form onSubmit={this.onSubmitHandler} autoComplete='off'>
        {/* input context provides context state/functions to formInputs */}
        <Card>
        <FlexColumn padding="true">
          <InputContext.Provider
            value={{
              addinput: this.addInputHandler,
              removeinput: this.removeInputHandler,
              changed: this.inputChangedHandler,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
              moveiteminarray: this.moveItemHandler,
          }}>
            <MultiInputObjects name='formbuilder' />

            <Separator class='Dashed' padding='true' direction="Horizontal"></Separator>

            <Button
              type='WithBorder'
              onClick={(event) => {
                console.log('Submit...');
                event.preventDefault();
                //this.submitInputRef.current.click();
              }}
              onMouseOver={() => {
                const event = new MouseEvent('mouseover', {
                  view: window,
                  bubbles: true,
                  cancelable: true,
                });

                //get the reference to the actual submit input and mimic a mouseover
                //this.submitInputRef.current.dispatchEvent(event);
              }}>
              Submit
            </Button>
          </InputContext.Provider>
          {/* <input
          ref={this.submitInputRef}
          type='submit'
          value='Submit'
          onMouseOver={(event) => {
            console.log('mouseover');
            this.onSubmitTest(event);
          }}
          // disabled={!this.state.formIsValid} //dont disable just handle with validation
        /> */}
        </FlexColumn>
        
        </Card>
      </form>
    );
    //console.log('this.state.errorModalMessage: ', this.state.errorModalMessage);
    
    return (
      <React.Fragment>
        {/* add modal just in-case needed, show binds to state of true/false */}
        <Modal show={this.state.saving}>
          <p>Saving</p>
        </Modal>
        
        <Modal
          label='Create new form'
          show={this.state.createNewFormModalIsOpen}
          isInteractive={true}
          footer={
            <React.Fragment>
              <Button
                onClick={event => {
                  this.setState({
                    createNewFormModalIsOpen: false, 
                    newFormName: '',
                    nameValid: null,
                    errorModalMessage: null
                  });
                }}
                type='WithBorder'
              >
                Cancel
              </Button>
              <Button
                onClick={event => {
                  event.preventDefault();
                  //reload page - push onto history stack
                  this.addNameQueryParamToUrl(this.state.newFormName);
                  this.props.onAddNewForm(this.state.newFormName);

                }}
                type='WithBorder'
                disabled={!this.state.nameValid}
              >
                Continue
              </Button>
            </React.Fragment>
          }

          modalClosed={this.modalClosedHandler}

        >

          <Label>Form Name</Label>
          <Input
            componentconfig={
            {
              validation:{
                isRequired:true, 
              }
            }}
            onChange={this.checkAvailability}
            value={{ 
              data: this.state.newFormName, 
              errors: this.state.errorModalMessage, 
              touched: true, //touched?
              pristine: false, //pristine?
              valid: this.state.nameValid
            }}
          />
          {/* <div className={classes.Errors}>{this.state.errorModalMessage}</div> */}
        </Modal>
        
        {/* {(query !== null && this.props.id === null) || */}
        {/* this.props.isLoading === true ? (
        <Spinner />) : ( */}



        <div className={classes.Formbuilder}>
          <DefaultPageLayout label='Form builder'>
            <Card>              
              {selectLoadOrNew}
            </Card>
            {this.state.loadOrCreateSelected? formBuilding: null}
          </DefaultPageLayout>
        </div>

        
        {/* )} */}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    schemaListPath: state.formbuilder.schemaListPath,
    formlist: state.formbuilder.formlist,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    //can be list of schemas or schema
    onFetchSchema: (schemapath) => {
      dispatch(actions.getSchema(schemapath)); 
    },

    onAddNewForm: (name)=>{
      dispatch(actions.addSchema(name));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(Formbuilder, axios));
