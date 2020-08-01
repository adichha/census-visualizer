import React, { Component } from 'react';
import {Layout, Switch as Toggle, Avatar, Col, Row, Card, Descriptions} from 'antd';
import { UserOutlined } from '@ant-design/icons';
export class Settings extends Component {
    constructor(props) {
      super(props);
      this.state = {
          mapStyle: "mapbox://styles/mapbox/dark-v9"
      }
    }  
    toggleDarkMode = checked => {
        console.log(`checked = ${checked}`);
        if (checked) {
          this.setState({ mapStyle: "mapbox://styles/mapbox/dark-v9" })
        } else {
          this.setState({ mapStyle: "mapbox://styles/mapbox/light-v9" })
        }
    }
    render(){
        return (
            <Layout style={{ minHeight: '100%' }}>
              <Row align="middle">
                <Col span={12} offset={6}>
                  <Card style={{textAlign: 'center'}}>
                    <div><Avatar size={64} icon={<UserOutlined />} /></div>
                    <Descriptions title="User Info">
                    <Descriptions.Item label="Username">user</Descriptions.Item>
                    <Descriptions.Item label="First Name">first</Descriptions.Item>
                    <Descriptions.Item label="Last Name">last</Descriptions.Item>
                    </Descriptions>
                    <div>Dark Mode <Toggle onChange={this.toggleDarkMode} /></div>
                  </Card>
                </Col>
              </Row>
            </Layout>
        );
    }
}