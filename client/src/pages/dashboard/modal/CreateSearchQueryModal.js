import React from 'react';
import { Modal, Form, Input, Radio, Select, Slider, InputNumber } from 'antd';

const { Option } = Select;


export const CreateSearchQueryModal = ({
  visible,
  onCreate,
  onCancel,
}) => {
  let selectedEmployment = false;
  const [form] = Form.useForm();
  return (
    <Modal
      visible={visible}
      title="Create a search query"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then(values => {
            console.log(values);
            form.resetFields();
            onCreate(values);
          })
          .catch(info => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
      >
        <Form.Item
          name="database"
          label="Database"
          rules={[{ required: true }]}
        >
          <Select
            showSearch
            style={{ width: '100%' }}
            placeholder="Select a database"
          >
            <Option value="education">Education</Option>
            <Option value="employment">Employment</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="sex"
          label="Sex Constraint"
          rules={[{ required: false }]}
        >
          <Select
            showSearch
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Select a sex"
            defaultValue={["male", "female"]}
            optionFilterProp="male"
            value={["male", "female"]}
          >
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
          </Select>
        </Form.Item>

        <div style={{ color: 'black' }}>
          Age Constraint
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <Form.Item name="age_lower" label="Lower Bound">
            <InputNumber
              min={0}
              max={100}
              defaultValue={0}
              placeholder='0'
              value={0}
            />
          </Form.Item>

          <div style={{ paddingTop: 35 }}>to </div>

          <Form.Item name="age_upper" label="Upper Bound">
            <InputNumber
              min={0}
              max={100}
              defaultValue={100}
              placeholder='100'
              value={100}
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};
