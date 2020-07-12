import React from 'react';
import { Modal, Form, Input, Radio, Select, Slider, InputNumber } from 'antd';

const { Option } = Select;


export const CreateSearchQueryModal = ({
  visible,
  onCreate,
  onCancel,
  query
}) => {
  let selectedEmployment = false;
  const [form] = Form.useForm();

  const updateValues = () =>{
    // could try making for loop 
    if(query && typeof form.getFieldsValue().database === 'undefined'){
      form.setFieldsValue({
        database: query.database
      })
    } if(query && typeof form.getFieldsValue().sex === 'undefined'){
      form.setFieldsValue({
        sex: query.sex
      })
    } if(query && typeof form.getFieldsValue().age_lower === 'undefined'){
      form.setFieldsValue({
        age_lower: query.age_lower
      })
    } if(query && typeof form.getFieldsValue().age_upper === 'undefined'){
      form.setFieldsValue({
        age_lower: query.age_upper
      })
    }
  }
  React.useEffect(() => {
    if(query){
      form.setFieldsValue({
        database: query.database,
        sex: query.sex,
        age_lower: query.age_lower,
        age_upper: query.age_upper
      });
    }
  }, []);

  return (
    <Modal
      visible={visible}
      title="Create a search query"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        updateValues();

        form
          .validateFields()
          .then(values => {
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
            defaultValue={query && query.database}
            value={query && query.database}
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
            defaultValue={query && query.sex || ["male", "female"]}
            optionFilterProp="male"
            value={query && query.sex || ["male", "female"]}
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
              defaultValue={query && query.age_lower || 0}
              placeholder={query && query.age_lower || '0'}
              value={query && query.age_lower|| 0}
            />
          </Form.Item>

          <div style={{ paddingTop: 35 }}>to </div>
{/* Need upper to be bigger than lower? */}
          <Form.Item name="age_upper" label="Upper Bound">
            <InputNumber
              min={0}
              max={100}
              defaultValue={query && query.age_upper !== 'undefined' || 100}
              placeholder={query && query.age_upper || '100'}
              value={query && query.age_upper !== 'undefined' || 100}
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};
