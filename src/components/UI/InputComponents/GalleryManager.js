import React, { PureComponent } from 'react';
import classes from './GalleryManager.module.scss';

import InputContext from '../../../context/InputContext';
import GalleryItem from './GalleryItem';

import Button from '../Button/Button';
import Icon from './Icon';
import { ReactSortable } from 'react-sortablejs';
// Class allows us to move items of the gallery
// Add and Remove items from gallery

class GalleryManager extends PureComponent {
  static contextType = InputContext;

  componentDidMount() {
    this.setState({ list: this.props.value });
  }

  componentDidUpdate() {
    console.log('ComponentDidUpdate GalleryManager');
    if (this.state.list !== this.props.value) {
      console.log('props.value update: ', this.props.value);
      this.setState({
        list: this.props.value,
      });
    }
  }

  state = {
    list: [],
  };

  render() {
    console.log('render...', this.state.list);
    const addButton = (
      <Button
        title='Add'
        type='WithBorder'
        className={classes.AddButton}
        onClick={(event) => {
          console.log('AddButton clicked');
          this.context.addinput(event, this.props.name, {
            key: '',
            value: '',
          });
        }}
      >
        <Icon iconstyle='fas' code='plus' size='sm' />
        <p>Add</p>
      </Button>
    );

    return (
      <div className={classes.GalleryManager}>
        {this.state.list.length ? (
          <div className={classes.GalleryItemsWrapper}>
            <ul>
              {this.state.list.map((val, index) => {
                return (
                  <li key={this.props.value + this.props.index}>
                    <GalleryItem
                      name={this.props.name}
                      value={val.id}
                      index={index}
                      onClick={(event) => {
                        this.context.removeidfromarray(
                          event,
                          this.props.name,
                          this.props.value.id
                        );
                      }}
                    >
                      {/* insert code here */}
                    </GalleryItem>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}

        {addButton}
      </div>
    );
  }
}

export default GalleryManager;
