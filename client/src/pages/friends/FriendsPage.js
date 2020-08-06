import React from 'react';
import { Input, AutoComplete, Table, Tag, Space, message, Modal, Button, Checkbox, Typography } from 'antd';
import { Api } from '../../network/api/Api';
const { Title } = Typography;
const educationLUT = {
  1: "total education",
  2: "no certificate, diploma or degree",
  3: "secondary (high) school diploma or equivalency certificate",
  4: "postsecondary certificate, diploma or degree",
  5: "apprenticeship or trades certificate or diploma",
  6: "trades certificate or diploma other than Certificate of Apprenticeship or Certificate of Qualification",
  7: "certificate of Apprenticeship or Certificate of Qualification",
  8: "college, CEGEP or other non-university certificate or diploma",
  9: "university certificate or diploma below bachelor level",
  10: "university certificate, diploma or degree at bachelor level or above",
  11: "bachelor's degree",
  12: "university certificate or diploma above bachelor level",
  13: "degree in medicine, dentistry, veterinary medicine or optometry",
  14: "master's degree",
  15: "earned doctorate",
}

const educationLUTReverse = {
  "total education": 1,
  "no certificate, diploma or degree": 2,
  "secondary (high) school diploma or equivalency certificate": 3,
  "postsecondary certificate, diploma or degree": 4,
  "apprenticeship or trades certificate or diploma": 5,
  "trades certificate or diploma other than Certificate of Apprenticeship or Certificate of Qualification": 6,
  "certificate of Apprenticeship or Certificate of Qualification": 7,
  "college, CEGEP or other non-university certificate or diploma": 8,
  "university certificate or diploma below bachelor level": 9,
  "university certificate, diploma or degree at bachelor level or above": 10,
  "bachelor's degree": 11,
  "university certificate or diploma above bachelor level": 12,
  "degree in medicine, dentistry, veterinary medicine or optometry": 13,
  "master's degree": 14,
  "earned doctorate": 15,
}

const incomeLUT = {
  1: "total income",
  2: "market income",
  3: "employment income",
  4: "wages, salaries and commissions",
  5: "net self-employment income",
  6: "investment income",
  7: "private retirement income",
  8: "market income not included elsewhere",
  9: "government transfers",
  10: "OAS and GIS",
  11: "CPP and QPP",
  12: "EI benefits",
  13: "child benefits",
  14: "other government transfers",
  15: "after-tax income",
  16: "income taxes"
};

const incomeLUTReverse = {
  "total income": 1,
  "market income": 2,
  "employment income": 3,
  "wages, salaries and commissions": 4,
  "net self-employment income": 5,
  "investment income": 6,
  "private retirement income": 7,
  "market income not included elsewhere": 8,
  "government transfers": 9,
  "OAS and GIS": 10,
  "CPP and QPP": 11,
  "EI benefits": 12,
  "child benefits": 13,
  "other government transfers": 14,
  "after-tax income": 15,
  "income taxes": 16
};

const sexLUT = {
  1: "malefemale",
  2: "male",
  3: "female"
};

const sexLUTReverse = {
  "malefemale": 1,
  "male": 2,
  "female": 3
};

const ageLUT = {
  1: "all", // probably don't need
  2: "15-24",
  3: "25-34",
  4: "35-44",
  5: "45-54",
  6: "55-64",
  7: "65+"
}

const ageLUTReverse = {
  "all": 1,
  "15-24": 2,
  "25-34": 3,
  "35-44": 4,
  "45-54": 5,
  "55-64": 6,
  "65+": 7
}

export class FriendsPage extends React.Component {
  state = {
    entries: [],
    friends: [],
    value: '',
    showModal: false,
    modalUsername: '',
    queries: []
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
          <Space size="middle" onClick={() => this.getUserQueries(record.username)}>
            <a>Show Queries</a>
          </Space>
        )
      }
      ,
    },
  ]

  queryColumns = [
    {
      title: 'Selected',
      key: 'selected',
      render: (text, record) => {
        return (
          <Checkbox checked={record.query.selected} onChange={() => this.toggleQuerySelected(record)}>
          </Checkbox>
        )
      }
    },
    {
      title: 'Query',
      dataIndex: 'query',
      key: 'query',
      render: (text, record) => {
        return (
          this.buildQuery(record.query)
        )
      }
    }
  ]

  toggleQuerySelected = (query) => {
    console.log(query);
    const result = this.state.queries;
    result[query.id].selected = !result[query.id].selected;
    this.setState({ queries: result });
  }

  componentDidMount() {
    Api.fetchFriends().then(friends => {
      this.setState({
        friends
      })
    })
  }

  async shareQueries() {
    const queries = this.state.queries;
    const username = this.state.modalUsername;
    const req = [];
    for (let i = 0; i < queries.length; ++i) {
      if (queries[i].selected) {
        // const shareQuery = {
        //   qid: qidqueries[i].,
        //   username: username
        // }
        // req.push(shareQuery);
        req.push(queries[i].qid)
      }
    }
    console.log(req)
    await Api.duplicateQueries(req);
    this.setState({ showModal: false, modalUsername: '', queries: [] })
  }

  async getUserQueries(username) {
    const apiQueries = await Api.getFriendQueries(username)

    let queries = [];
    for (let i = 0; i < apiQueries.length; ++i) {
      // note: need to deal w query exists?
      const apiQuery = apiQueries[i];
      const education = [];
      const income = [];
      let sex = [];
      const age = [];
      if (!(apiQuery.params.length == 1 && apiQuery.params[0] == 1)) {
        if (apiQuery.dataset === "education") {

          for (let j = 0; j < apiQuery.params.length; ++j) {
            education.push(educationLUT[apiQuery.params[j]]);
          }
        } else if (apiQuery.dataset === "employment") {
          for (let j = 0; j < apiQuery.params.length; ++j) {
            income.push(incomeLUT[apiQuery.params[j]]);
          }
        }
      }
      sex = apiQuery.sex && apiQuery.sex !== 1 ? [sexLUT[apiQuery.sex]] : ["male", "female"];
      // TODO: i should not be storing malefemale 
      if (apiQuery.age) {
        for (let j = 0; j < apiQuery.age.length; ++j) {
          if (apiQuery.age[j] !== 1) {
            age.push(ageLUT[apiQuery.age[j]]);
          }
        }
      }
      const query = {
        qid: apiQuery.qid,
        database: apiQuery.dataset,
        education: education,
        income: income,
        sex: sex,
        age: age,
        selected: false
      };

      queries.push(query);
    }

    console.log(queries)
    this.setState({ showModal: true, modalUsername: username, queries: queries })
  }

  buildQuery = query => {
    if (query !== undefined) {
      const { database, age, sex, income, education } = query;
      let str = "";
      str += `Showing`;
      if (database === "employment") {
        if (!income || income.length == 0 || income.length == 15) {
          str += ` total income`;
        } else {
          str += this.buildQueryArrayHelper(income);
        }
      } else if (database === "education") {
        if (!education || education.length == 0 || education.length == 14) {
          str += ` total education`;
        } else {
          str += this.buildQueryArrayHelper(education);
        }
      }
      str += ` from ${database}`;
      if (sex) {
        if (sex.length == 0) {
          // TODO: add to male/female?
        }
        str += ` where sex is `;
        str += this.buildQueryArrayHelper(sex);
      }

      if (sex && age && age.length > 0) {
        str += ' and';
      }

      // make it lower range bound (15, 25, 35)
      if (age && age.length > 0) {
        str += ` where age is `;
        str += this.buildQueryArrayHelper(age);
      }
      return str;
    }
  }

  buildQueryArrayHelper = (array) => {
    let str = "";
    for (let i = 0; i < array.length; ++i) {
      str += ` ${array[i]}`;
      if (i < array.length - 1) str += `,`;
    }
    return str;
  }

  render() {
    console.log(this.state.friends)
    const onSelect = async (data) => {
      const username = data.split(":")[0];
      await Api.addFriend([username]);
      this.setState({
        friends: [...this.state.friends, { username }],
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
            username: friend.username,
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
            <Button key="back" onClick={() => this.shareQueries()}>
              Copy
            </Button>,
          ]}
        >
          <Table columns={this.queryColumns} dataSource={this.state.queries.map((query, i) => {
            return {
              id: i,
              query: query
            }
          })} />

        </Modal>
        <Title level={4}>Shared Queries</Title>
        <Input.Search size="large" placeholder="import your friend's query here" onSearch={value => console.log(value)} enterButton="Copy" />
      </div >
    );
  }
}