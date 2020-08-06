import React, { useState } from 'react';
import { Modal, Form, Input, Radio, Select, Slider, InputNumber } from 'antd';

const { Option } = Select;


export const CreateSearchQueryModal = ({
  isCreate,
  visible,
  onCreate,
  onCancel,
  query
}) => {
  const [databaseVal, setDatabaseVal] = useState(0);

  const [form] = Form.useForm();
  function handleChange(value){
    setDatabaseVal(value);
  }

  const updateValues = () =>{
    // could try making for loop 
    if(query && typeof form.getFieldsValue().database === 'undefined'){
      form.setFieldsValue({
        database: query.database
      })
    } if(query && typeof form.getFieldsValue().employment === 'undefined'){
      form.setFieldsValue({
        employment: query.employment
      })
    } if(query && typeof form.getFieldsValue().income === 'undefined'){
      form.setFieldsValue({
        income: query.income
      })
    } if(query && typeof form.getFieldsValue().education === 'undefined'){
      form.setFieldsValue({
        education: query.education
      })
    } if(query && typeof form.getFieldsValue().sex === 'undefined'){
      form.setFieldsValue({
        sex: query.sex
      })
    } if(query && typeof form.getFieldsValue().age === 'undefined'){
      form.setFieldsValue({
        age: query.age
      })
    }
  }
  React.useEffect(() => {
    if(query){
      setDatabaseVal(query.database);
      form.setFieldsValue({
        database: query.database,
        employment: query.employment,
        income: query.income,
        education: query.education,
        sex: query.sex,
        age: query.age
      });
    }
  }, []);

  return (
    <Modal
      visible={visible}
      title={isCreate ? "Create search query" : "Edit search query"}
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        updateValues();
        console.log(form.getFieldsValue().database);
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
            onChange={handleChange}
          >
            <Option value="education">Education</Option>
            <Option value="employment">Employment</Option>
            <Option value="income">Income</Option>
            <Option value="population">Population</Option>
          </Select>
        </Form.Item>
        {databaseVal == "employment" ? (<Form.Item
          name="employment"
          label="Employment"
          rules={[{ required: false }]}
        >
        <Select
            showSearch
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Select type of employment"
            defaultValue={query && query.employment || []}
            value={query && query.employment|| []}
          >
            <Option value="employed">Employed</Option>
            <Option value="unemployed">Unemployed</Option>
          </Select>
        </Form.Item>
        ) : null}
        {databaseVal == "income" ? (<Form.Item
          name="income"
          label="Income"
          rules={[{ required: false }]}
        >
        <Select
            showSearch
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Select type of income"
            defaultValue={query && query.income || []}
            value={query && query.income|| []}
          >
            <Option value="market income">Market income</Option>
            <Option value="employment income">Employment income</Option>
            <Option value="wages, salaries and commissions">Wages, salaries and commissions</Option>
            <Option value="net self-employment income">Net self-employment income</Option>
            <Option value="investment income">Investment income</Option>
            <Option value="private retirement income">Private retirement income</Option>
            <Option value="market income not included elsewhere">Market income not included elsewhere</Option>
            <Option value="government transfers">Government transfers</Option>
            <Option value="OAS and GIS">OAS and GIS</Option>
            <Option value="CPP and QPP">CPP and QPP</Option>
            <Option value="EI benefits">EI benefits</Option>
            <Option value="child benefits">Child benefits</Option>
            <Option value="other government transfers">Other government transfers</Option>
            <Option value="after-tax income">After-tax income</Option>
            <Option value="income taxes">Income taxes</Option>
          </Select>
        </Form.Item>
        ) : null}
        {databaseVal == "education" ? (<Form.Item
          name="education"
          label="Education"
          rules={[{ required: false }]}
        >
        <Select
            showSearch
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Select level of education"
            defaultValue={query && query.education || []}
            value={query && query.education|| []}
          >
            <Option value="no certificate, diploma or degree">No certificate, diploma or degree</Option>
            <Option value="secondary (high) school diploma or equivalency certificate">Secondary (high) school diploma or equivalency certificate</Option>
            <Option value="postsecondary certificate, diploma or degree">Postsecondary certificate, diploma or degree</Option>
            <Option value="apprenticeship or trades certificate or diploma">Apprenticeship or trades certificate or diploma</Option>
            <Option value="trades certificate or diploma other than Certificate of Apprenticeship or Certificate of Qualification">Trades certificate or diploma other than Certificate of Apprenticeship or Certificate of Qualification</Option>
            <Option value="certificate of Apprenticeship or Certificate of Qualification">Certificate of Apprenticeship or Certificate of Qualification</Option>
            <Option value="college, CEGEP or other non-university certificate or diploma">College, CEGEP or other non-university certificate or diploma</Option>
            <Option value="university certificate or diploma below bachelor level">University certificate or diploma below bachelor level</Option>
            <Option value="university certificate, diploma or degree at bachelor level or above">University certificate, diploma or degree at bachelor level or above</Option>
            <Option value="bachelor's degree">Bachelor's degree</Option>
            <Option value="university certificate or diploma above bachelor level">University certificate or diploma above bachelor level</Option>
            <Option value="degree in medicine, dentistry, veterinary medicine or optometry">Degree in medicine, dentistry, veterinary medicine or optometry</Option>
            <Option value="master's degree">Master's degree</Option>
            <Option value="earned doctorate">Earned doctorate</Option>
          </Select>
        </Form.Item>
        ) : null}
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
        <Form.Item
          name="age"
          label="Age Constraint"
          rules={[{ required: false }]}
        >
          <Select
            showSearch
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Select age intervals"
            defaultValue={query && query.age || []}
            value={query && query.age || []}
          >
            <Option value="15-24">15-24</Option>
            <Option value="25-34">25-34</Option>
            <Option value="35-44">35-44</Option>
            <Option value="45-54">45-54</Option>
            <Option value="55-64">55-64</Option>
            <Option value="65+">65+</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};
