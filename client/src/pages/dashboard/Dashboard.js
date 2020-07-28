import React from 'react';
import { Layout, Menu } from 'antd';
import {
  PieChartOutlined,
} from '@ant-design/icons';
import {
  Link
} from "react-router-dom";

import {
  LoginOutlined
} from '@ant-design/icons';
import { Map } from './Map';
import { Api } from '../../network/api/Api';

const { Sider } = Layout;

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