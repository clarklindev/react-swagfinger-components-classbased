import React, { Component } from 'react';
import DefaultPageLayout from '../../hoc/DefaultPageLayout/DefaultPageLayout';
import Card from '../../components/UI/Card/Card';
import Upload from '../../components/UI/Upload/Upload';
import classes from './UploadContent.module.scss';

class UploadContent extends Component {
  render() {
    return (
      <DefaultPageLayout label='Upload'>
        <Card>
          <Upload></Upload>
        </Card>
      </DefaultPageLayout>
    );
  }
}

export default UploadContent;
