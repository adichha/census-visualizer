import React from 'react';
import { Alert, Card, Typography, message } from 'antd';
import { Form, Input, Button, Checkbox } from 'antd';
import { UserStore } from '../../stores/UserStore';
import { withRouter } from 'react-router-dom'

const { Title } = Typography;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

class RegisterPageNoRouter extends React.Component {
  state = {
    registerFailed: false,

  }
  onFinish = async values => {
    const registerFailed = await UserStore.signUpUser(values);
    if (!registerFailed) {
      message.success("Successfully registered!")
      this.props.history.push('/login');
    }
    this.setState({
      registerFailed
    })
  };

  onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  render() {
    return (
      <Card style={{ width: 500 }}>
        <div style={{ margin: 'auto', textAlign: 'center' }}>
          <Title level={2}>Register</Title>
        </div>
        <Form
          {...layout}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
        >
          {this.state.registerFailed && <Alert style={{ marginBottom: 20 }} message="Failed to register" type="error" />}
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="First Name"
            name="first_name"
            rules={[{ required: true, message: 'Please input your first name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="last_name"
            rules={[{ required: true, message: 'Please input your last name!' }]}
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

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Register
        </Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }
}

const RegisterPageWithRouter = withRouter(RegisterPageNoRouter);

export { RegisterPageWithRouter as RegisterPage }