import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
//js
import './App.scss';
import Layout from './hoc/Layout/Layout';
import Phonebook from './containers/Phonebook/Phonebook';
import AdminPhonebook from './containers/AdminPhonebook/AdminPhonebook';
import Auth from './containers/Auth/Auth';

class App extends Component {
  render() {
    return (
      <Layout>
        <div className="App">
          <Switch>
            <Route path="/phonebook" component={Phonebook} />
            <Route path="/phonebookadmin" component={AdminPhonebook} />
            <Route path="/auth" component={Auth} />
            <Route path="/" component={Auth} />
          </Switch>
        </div>
      </Layout>
    );
  }
}

export default App;
