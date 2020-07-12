import React from 'react';
import { LoginPage } from '../login/LoginPage';
import { Layout, Menu, Breadcrumb, Select, Checkbox, Row, Col, Button } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  SearchOutlined
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
import { Map } from './Map';


const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const { Option } = Select;


function onChange(e) {
  console.log(`checked = ${e.target.checked}`);
}

export class Dashboard extends React.Component {
  state = {
    collapsed: false,
  };

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  onChange = e => {
    console.log(`checked = ${e.target.checked}`);
  }

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
          <div style={{ height: '100%', position: 'relative' }}>
            <Map />
          </div>
        </Layout>
      </Layout>
    );
  }
}