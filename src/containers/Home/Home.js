import DefaultPageLayout from '../../hoc/DefaultPageLayout/DefaultPageLayout';

import Card from '../../components/UI/Card/Card';
import Upload from '../../components/UI/Upload/Upload';
import React, { Component } from 'react';
class Home extends Component {
  state = {
    checkboxChecked: false,
  };

  accordionConfig = {
    allowMultiOpen: false,
    openOnStartIndex: -1, //zero-index, negative value or invalid index to not open on start,
    hovereffect: true,
    onClick: () => {
      console.log('ouside onclick');
    },
    style: {},
  };

  checkboxConfig = {
    checked: this.state.checkboxChecked,
    label: 'label for checkbox',
    onChange: (value) => {
      this.setState({ checkboxChecked: value });
    },
  };

  render() {
    return (
      <div>
        <DefaultPageLayout label='Components'>
          <Card style={['Padding']}>
            <Upload />
          </Card>
        </DefaultPageLayout>
      </div>
    );
  }
}

export default Home;
