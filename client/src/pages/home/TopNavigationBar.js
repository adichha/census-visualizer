import React from 'react';
import { Menu } from 'antd';
import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import styled from 'styled-components';

const { SubMenu } = Menu;

const RightContainer = styled.div`
  float: right;
`

export class TopNavigationBar extends React.Component {
  state = {
    current: 'mail',
  };

  handleClick = e => {
    console.log('click ', e);
    this.setState({
      current: e.key,
    });
  };

  render() {
    return (
      <RightContainer>
        <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal">
          <Menu.Item
            key="home">
            <Link to="/">
              Home
        </Link></Menu.Item>
          <Menu.Item
            key="dashboard">
            <Link to="/dashboard">
              Dashboard
        </Link></Menu.Item>
          <Menu.Item
            key="register">
            <Link to="/register">
              Register
        </Link>
          </Menu.Item>
          <Menu.Item key="sigin">
            <Link to="/login">
              Sign In
        </Link>
          </Menu.Item>
        </Menu>
      </RightContainer>
    );
  }
}