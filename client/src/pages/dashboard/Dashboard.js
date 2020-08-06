import React from 'react';
import { Layout, Menu } from 'antd';
import {
  PieChartOutlined,
  SettingOutlined,
  UsergroupAddOutlined
} from '@ant-design/icons';
import {
  Link
} from "react-router-dom";

import {
  LoginOutlined
} from '@ant-design/icons';
import { Map } from './Map';
import { Settings } from './Settings';
import { FriendsPage } from '../friends/FriendsPage'


const { Sider } = Layout;

function onChange(e) {
  console.log(`checked = ${e.target.checked}`);
}

export class Dashboard extends React.Component {
  state = {
    collapsed: false,
    page: 1,
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
            <Menu.Item key="1" icon={<PieChartOutlined />} onClick={() => this.setState({ page: 0 })}>
              Visualization
            </Menu.Item>
            <Menu.Item key="2" icon={<UsergroupAddOutlined />} onClick={() => this.setState({ page: 1 })}>
              Friends
            </Menu.Item>
            <Menu.Item key="3" icon={<SettingOutlined />} onClick={() => this.setState({ page: 2 })}>
              Account Settings
            </Menu.Item>
            <Menu.Item key="4" icon={<LoginOutlined />}>
              <Link to='/'>
                Log out
            </Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <div style={{ height: '100%', position: 'relative' }}>
            {this.state.page === 0 && <Map />}
            {this.state.page === 1 && <FriendsPage />}
            {this.state.page === 2 && <Settings />}
          </div>
        </Layout>
      </Layout>
    );
  }
}