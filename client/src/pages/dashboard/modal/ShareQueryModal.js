import React, { useState } from 'react';
import { Modal, Form, Input, Table, Radio, Select, Slider, InputNumber, AutoComplete } from 'antd';
import { Api } from '../../../network/api/Api';
const { Option } = Select;


export const ShareQueryModal = ({
  queries,
  visible,
  onCreate,
  onCancel,
}) => {
    const [value, setValue] = useState('');
    const [friendsVal, setFriendsVal] = useState([]);
    const [entries, setEntries] = useState([]);

    function handleChange(value){
        setValue(value);
    }
    const onSelect = async (data) => {
        const username = data.split(":")[0];
        setFriendsVal([...friendsVal, {username}])
        setValue('')
      };
  
      const onSearch = async (searchText) => {
        const friends = await Api.fetchFriends();
        setEntries(friends.map(obj => `${obj.username}: ${obj.firstName} ${obj.lastName}`));
    }

  return (
    <Modal
      visible={visible}
      title="Share Queries"
      okText="Share"
      cancelText="Cancel"
      onCancel={() => {
          onCancel();
          setEntries([])
          setValue('')
          setFriendsVal([])
        }
    }
      onOk={() => {
        console.log("test")
        console.log(queries)
        const result = [];
        for(let i = 0; i < queries.length; ++i){
            for(let j = 0; j < friendsVal.length; ++j){
                result.push({
                    "username": friendsVal[j].username,
                    "qid": queries[i]
                });
            }
        }
        onCreate(result)
        setEntries([])
        setValue('')
        setFriendsVal([])
      }}
    >
        <div style={{ display: 'flex', width: '100%' }}>
          <AutoComplete
            value={value}
            onChange={handleChange}
            options={entries.map(value => { return { value }; })}
            style={{ width: '100%', justifyContent: 'center', margin: '0 auto', display: 'block' }}
            onSelect={onSelect}
            onSearch={onSearch}
          >
            <Input.Search size="large" placeholder="input here" enterButton />
          </AutoComplete>
        </div>
        <Table columns={  [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    }]} dataSource={friendsVal.map((friend, i) => {
          return {
            id: i,
            username: friend.username,
          }
        })} />
      
    </Modal>
  );
};
