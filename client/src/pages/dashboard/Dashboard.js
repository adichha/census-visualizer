import React from 'react';
import { LoginPage } from '../login/LoginPage';
import { Layout, Menu, Breadcrumb } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import {
  PieChartOutline,
  SettingOutlined,
  LoginOutlined
} from '@ant-design/icons';


const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

export class Dashboard extends React.Component {
  state = {
    collapsed: false,
  };

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1" icon={<PieChartOutlined />}>
              Visualization
            </Menu.Item>
            <Menu.Item key="2" icon={<SettingOutlined />}>
              Account Settings
            </Menu.Item>
            <Menu.Item key="3" icon={<LoginOutlined />}>
              <Link to='/'>
                Log out
            </Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Content style={{ margin: '16px 16px' }}>
            Hello this is the content :/
          </Content>
          <Footer style={{ textAlign: 'center' }}>CS 348 Census Visualization ©2020</Footer>
        </Layout>
      </Layout>
    );
  }
}