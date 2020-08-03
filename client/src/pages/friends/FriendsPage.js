import React from 'react';
import { Input, AutoComplete, Table, Tag, Space, message, Modal, Button } from 'antd';
import { Typography } from 'antd';
import { Api } from '../../network/api/Api';
const { Title } = Typography;
const data = [
  {
    key: '1',
    username: 'abcsdf',
    // first_name: 'John',
    // last_name: 'Doe',
  },
  {
    key: '2',
    username: 'my_name_jeff',
    // first_name: 'Jim',
    // last_name: 'Doe',
  },
]

export class FriendsPage extends React.Component {
  state = {
    entries: [],
    friends: [],
    value: '',
    showModal: false,
    modalUsername: '',
  }


  columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    // {
    //   title: 'First Name',
    //   dataIndex: 'first_name',
    //   key: 'first_name',
    // },
    // {
    //   title: 'Last Name',
    //   dataIndex: 'last_name',
    //   key: 'last_name',
    // },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => {
        return (
          <Space size="middle" onClick={() => this.setState({ showModal: true, modalUsername: record.username })}>
            <a>Show Queries</a>
          </Space>
        )
      }
      ,
    },
  ]


  componentDidMount() {
    Api.fetchFriends().then(friends => {
      this.setState({
        friends
      })
    })
  }

  render() {
    const onSelect = async (data) => {
      const username = data.split(":")[0];
      await Api.addFriend([username]);
      this.setState({
        friends: [...this.state.friends, username],
        value: '',
      })
      message.success(`Successfully added ${username}`)
    };

    const onSearch = (searchText) => {
      Api.searchFriend(searchText).then(entries => {
        this.setState({
          entries: entries.map(obj => `${obj.username}: ${obj.firstName} ${obj.lastName}`)
        })
      })
      // setOptions(
      //   !searchText ? [] : [mockVal(searchText), mockVal(searchText, 2), mockVal(searchText, 3)],
      // );
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', margin: 30 }}>
        <Title level={4}>Add Friends</Title>
        <div style={{ display: 'flex', width: '100%' }}>
          <AutoComplete
            value={this.state.value}
            onChange={e => {
              this.setState({
                value: e
              })
            }
            }
            options={this.state.entries.map(value => { return { value }; })}
            style={{ width: '100%', justifyContent: 'center', margin: '0 auto', display: 'block' }}
            onSelect={onSelect}
            onSearch={onSearch}
          >
            <Input.Search size="large" placeholder="input here" enterButton />
          </AutoComplete>
        </div>
        <div style={{ paddingTop: 20 }} />
        <Title level={4}>Friends List</Title>
        <Table columns={this.columns} dataSource={this.state.friends.map((friend, i) => {
          return {
            id: i,
            username: friend,
          }
        })} />
        <Modal
          title={`Queries for ${this.state.modalUsername}`}
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
          <p>This user doesn't have any queries...</p>
        </Modal>
      </div >
    );
  }
}