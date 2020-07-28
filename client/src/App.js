import React from 'react';
import { Layout, Typography } from 'antd';
import { LoginPage } from './pages/login/LoginPage';
import styled from 'styled-components';
import { RegisterPage } from './pages/register/RegisterPage';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { Observer } from 'mobx-react'
import { TopNavigationBar } from './pages/home/TopNavigationBar';
import { Dashboard } from './pages/dashboard/Dashboard';
import { PersistenceStore } from './stores/PersistenceStore';
import { UserStore } from './stores/UserStore';
const { Title } = Typography;

const Container = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
`;


export class App extends React.Component {
  componentDidMount() {
    PersistenceStore.fetchItems();
  }

  render() {
    return (
      <Observer>{() =>
        <Router>
          <Switch>
            <Route path="/login">
              <TopNavigationBar />
              <Container>
                <LoginPage />
              </Container>
            </Route>
            <Route path="/register">
              <TopNavigationBar />
              <Container>
                <RegisterPage />
              </Container>
            </Route>
            <Route path="/dashboard">
              <Dashboard />
            </Route>
            <Route path="/">
              <TopNavigationBar />
              <Container>
                <Title level={1} style={{ textAlign: 'center' }}>CS 348 Project</Title>
                <Title level={3} style={{ textAlign: 'center' }}>Census Data Visualization</Title>
              </Container>
            </Route>
          </Switch>
        </Router>
      }
      </Observer>
    );
  }
}

export default App;
