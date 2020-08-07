import React, { Component } from 'react';
import {Layout, List, Switch as Toggle, Avatar, Col, Row, Card, Descriptions, Modal, Button} from 'antd';
import {
   UserOutlined,
   SketchOutlined,
   DribbbleOutlined,
   HeartOutlined, 
   WomanOutlined,
   StarOutlined,
   RocketOutlined,
   FireOutlined,
   ConsoleSqlOutlined
} from '@ant-design/icons';
import { Api } from '../../network/api/Api';

const iconMap = {
  0: <UserOutlined />,
  1: <SketchOutlined />,
  2: <DribbbleOutlined />,
  3: <HeartOutlined />,
  4: <WomanOutlined />,
  5: <StarOutlined />,
  6: <RocketOutlined />,
  7: <FireOutlined />,
};

export class Settings extends Component {
    constructor(props) {
      super(props);
      this.state = {
        username: '',
        first: '',
        last: '',
        numQueries: 0,
        isDarkModeEnabled: false,
        showModal: false,
        icon: 0
      }
    }
    
    componentDidMount() {
      this.fetchUserInfo();
    }

    async fetchUserInfo() {
      const userInfo = await Api.getUserMe();
      this.setState({
        username: userInfo.user_name,
        first: userInfo.first_name,
        last: userInfo.last_name,
        numQueries: userInfo.num_queries,
        isDarkModeEnabled: userInfo.dark_mode,
        icon: userInfo.icon
      });
    }

    toggleDarkMode = async (checked) => {
      // TODO: call api when backend is up
      if(checked){
        await Api.updateDarkMode(true);
      } else await Api.updateDarkMode(false);
      this.setState({isDarkModeEnabled: checked});
    }

    async updateIcon(icon){
      await Api.updateIcon(icon);
      this.setState({
        icon: icon,
        showModal: false
      })
    }

    render(){
        return (
            <Layout style={{ minHeight: '100%' }}>
              <Row align="middle">
                <Col span={12} offset={6}>
                  <Card style={{textAlign: 'center'}}>
                    <div><Avatar size={64} icon={iconMap[this.state.icon]} onClick={() => this.setState({showModal: true})} /></div>
                    <Descriptions style={{marginTop: "20px"}} title="User Info">
                    <Descriptions.Item label="Username">{this.state.username}</Descriptions.Item>
                    <Descriptions.Item label="First Name">{this.state.first}</Descriptions.Item>
                    <Descriptions.Item label="Last Name">{this.state.last}</Descriptions.Item>
                    <Descriptions.Item label="Number Of Queries">{this.state.numQueries}</Descriptions.Item>
                    </Descriptions>
                    <div>Dark Mode <Toggle checked={this.state.isDarkModeEnabled} onChange={this.toggleDarkMode} /></div>
                  </Card>
                </Col>
              </Row>
              <Modal
              title={`Set Profile Icon`}
              centered
              visible={this.state.showModal}
              onOk={() => this.setState({ showModal: false })}
              onCancel={() => this.setState({ showModal: false })}
              footer={[
                <Button key="back" onClick={() => this.setState({ showModal: false })}>
                  Close
                </Button>,
              ]}
            >
              <Row>
                <Col span={6}><Avatar size={48} onClick={() => this.updateIcon(0)} icon={<UserOutlined />}/></Col>
                <Col span={6}><Avatar size={48} onClick={() => this.updateIcon(1)} icon={<SketchOutlined />}/></Col>
                <Col span={6}><Avatar size={48} onClick={() => this.updateIcon(2)} icon={<DribbbleOutlined />}/></Col>
                <Col span={6}><Avatar size={48} onClick={() => this.updateIcon(3)} icon={<HeartOutlined />}/></Col>
              </Row>
              <br></br>
              <Row>
                <Col span={6}><Avatar size={48} onClick={() => this.updateIcon(4)} icon={<WomanOutlined />}/></Col>
                <Col span={6}><Avatar size={48} onClick={() => this.updateIcon(5)} icon={<StarOutlined />}/></Col>
                <Col span={6}><Avatar size={48} onClick={() => this.updateIcon(6)} icon={<RocketOutlined />}/></Col>
                <Col span={6}><Avatar size={48} onClick={() => this.updateIcon(7)} icon={<FireOutlined />}/></Col>
              </Row>

            </Modal>
            </Layout>
            
        );
    }
}