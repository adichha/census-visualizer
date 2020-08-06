import React, { Component } from 'react';
import {Layout, Switch as Toggle, Avatar, Col, Row, Card, Descriptions} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Api } from '../../network/api/Api';

export class Settings extends Component {
    constructor(props) {
      super(props);
      this.state = {
        username: '',
        first: '',
        last: '',
        numQueries: 0,
        isDarkModeEnabled: false
      }
    }
    
    componentDidMount() {
      this.fetchUserInfo();
    }

    async fetchUserInfo() {
      const userInfo = await Api.getUserMe();
      // const userInfo = {dark_mode: true};
      await this.setState({
        username: userInfo.user_name,
        first: userInfo.first_name,
        last: userInfo.last_name,
        numQueries: userInfo.num_queries,
        isDarkModeEnabled: userInfo.dark_mode
      });
    }

    toggleDarkMode = (checked) => {
      // TODO: call api when backend is up
      if(checked){
        Api.updateDarkMode(true);
      } else Api.updateDarkMode(false);
      this.setState({isDarkModeEnabled: checked});
    }
    render(){
        return (
            <Layout style={{ minHeight: '100%' }}>
              <Row align="middle">
                <Col span={12} offset={6}>
                  <Card style={{textAlign: 'center'}}>
                    <div><Avatar size={64} icon={<UserOutlined />} /></div>
                    <Descriptions title="User Info">
                    <Descriptions.Item label="Username">{this.state.username}</Descriptions.Item>
                    <Descriptions.Item label="First Name">{this.state.first}</Descriptions.Item>
                    <Descriptions.Item label="Last Name">{this.state.last}</Descriptions.Item>
                    <Descriptions.Item label="Number Of Queries">{this.state.numQueries}</Descriptions.Item>
                    </Descriptions>
                    <div>Dark Mode <Toggle checked={this.state.isDarkModeEnabled} onChange={this.toggleDarkMode} /></div>
                  </Card>
                </Col>
              </Row>
            </Layout>
        );
    }
}