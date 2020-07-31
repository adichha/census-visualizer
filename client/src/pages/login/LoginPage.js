import React from 'react';
import { Alert, Card, Typography, message } from 'antd';
import { Form, Input, Button, Checkbox } from 'antd';
import { UserStore } from '../../stores/UserStore';
import { withRouter } from 'react-router';
const { Title } = Typography;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

class LoginPageNoRouter extends React.Component {
  state = {
    loginFailed: false
  }

  onFinish = async (values) => {
    const loginFailed = await UserStore.loginUser(values);
    if (!loginFailed) {
      message.success("Successfully logged in. Welcome!")
      this.props.history.push('/dashboard')
    }
    this.setState({
      loginFailed
    })
  };

  onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  render() {
    return (
      <Card style={{ width: 500 }}>
        <div style={{ margin: 'auto', textAlign: 'center' }}>
          <Title level={2}>Login</Title>
        </div>
        <Form
          {...layout}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
        >
          {this.state.loginFailed && <Alert style={{ marginBottom: 20 }} message="Failed to login" type="error" />}
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item {...tailLayout} valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Login
        </Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }
}

const LoginPageWithRouter = withRouter(LoginPageNoRouter);

export { LoginPageWithRouter as LoginPage }