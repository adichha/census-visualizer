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
          {/* <Header> */}
          <Row>
            <Col span={3}>
              <Select placeholder="age" style={{ width: 120 }} allowClear>
                <Option value="15">15-24</Option>
                <Option value="25">25-34</Option>
                <Option value="35">35-44</Option>
                <Option value="45">45-54</Option>
                <Option value="55">55-64</Option>
                <Option value="65">65+</Option>
              </Select></Col>
            <Col span={3}><Select placeholder="sex" style={{ width: 120 }} allowClear>
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
            </Select></Col>
            <Col span={3}><Select placeholder="education" style={{ width: 120 }} allowClear>
              <Option value="none">None</Option>
              <Option value="hs">High School</Option>
              <Option value="associate">Associate Degree</Option>
              <Option value="bachelor">Bachelor's Degree</Option>
              <Option value="master">Master's Degree</Option>
              <Option value="doctoral">Doctoral Degree</Option>
            </Select></Col>
            <Col span={3}>
              <Checkbox onChange={onChange}>Employed</Checkbox>
            </Col>
            <Col span={3}>
              <Select placeholder="income" style={{ width: 120 }} allowClear>
                <Option value="u30">Under 30,000</Option>
                <Option value="30">30,000-50,000</Option>
                <Option value="50">50,000-75,000</Option>
                <Option value="75">75,000-100,000</Option>
                <Option value="o100">Over 100,000</Option>
              </Select></Col>
            <Button type="primary" icon={<SearchOutlined />}>
              Search
        </Button>
            <Button>Save Query</Button>
          </Row>
          {/* </Header> */}
          <div style={{ height: '100%', position: 'relative' }}>
            <Map />
          </div>
          <Footer style={{ textAlign: 'center' }}>CS 348 Census Visualization ©2020</Footer>
        </Layout>
      </Layout>
    );
  }
}