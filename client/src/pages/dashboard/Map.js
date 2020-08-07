import React, { Component } from 'react';
import ReactMapGL, { Source, Layer } from 'react-map-gl';
import { heatmapLayer } from './map-style';
import { List, Layout, Typography, Button, Checkbox } from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  ShareAltOutlined as ShareOutlined
} from '@ant-design/icons'
import { UserStore } from '../../stores/UserStore';
import { ShareQueryModal } from './modal/ShareQueryModal';
import { CreateSearchQueryModal } from './modal/CreateSearchQueryModal';
import { queries } from '@testing-library/react';
import { Api } from '../../network/api/Api';
import { Legend } from './Legend';
import './app.css';
import {VisualQueryEditor} from "./VisualQueryEditor";

const { Sider, Content } = Layout;
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
  1: "all",
  2: "15-24",
  5: "25-34",
  6: "35-44",
  7: "45-54",
  8: "55-64",
  9: "65+"
}

const ageLUTReverse = {
  "all": 1,
  "15-24": 2,
  "25-34": 5,
  "35-44": 6,
  "45-54": 7,
  "55-64": 8,
  "65+": 9
}

const employmentLUT = {
  1: "employed",
  2: "unemployed"
}

const employmentLUTReverse = {
  "employed": 1,
  "unemployed": 2
}


export class Map extends Component {
  constructor(props) {
    super(props);
    const current = new Date().getTime();
    this.state = {
      viewport: {
        latitude: 43.4643,
        longitude: -80.5204,
        zoom: 8,
        maxZoom: 8.4,
      },
      selectedTime: current,
      modalVisible: false,
      mapStyle: '',
      queries: [],
      sharedQueries: [],
      queryResults: [],
      isLoading: false,
      username: '',
      shareModalVisible: false
    };
  }

  componentDidMount() {
    this.fetchData();
    this.setMapStyle();
  }

  async setMapStyle() {
    const userInfo = await Api.getUserMe();
    if (userInfo && userInfo.dark_mode) {
      this.setState({ mapStyle: "mapbox://styles/mapbox/dark-v9", username: userInfo.user_name })
    } else {
      this.setState({ mapStyle: "mapbox://styles/mapbox/light-v9", username: userInfo.user_name })
    }
  }

  async fetchData() {
    const userQueries = await Api.fetchAllQueries();
    const sharedQueries = await Api.getSharedQueries();
    console.log("ETSTETSET")
    console.log(sharedQueries)
    const apiQueries = [...userQueries, ...sharedQueries];
    let queries = [];
    for (let i = 0; i < apiQueries.length; ++i) {
      const apiQuery = apiQueries[i];
      const education = [];
      const income = [];
      const employment = [];
      const age = [];
      if (!(apiQuery.params.length === 1 && apiQuery.params[0] === 1)) {
        if (apiQuery.dataset === "education") {

          for (let j = 0; j < apiQuery.params.length; ++j) {
            education.push(educationLUT[apiQuery.params[j]]);
          }
        } else if (apiQuery.dataset === "employment") {
          for (let j = 0; j < apiQuery.params.length; ++j) {
            employment.push(employmentLUT[apiQuery.params[j]]);
          }
        } else if (apiQuery.dataset === "income") {
          for (let j = 0; j < apiQuery.params.length; ++j) {
            income.push(incomeLUT[apiQuery.params[j]]);
          }
        }
      }
      const sex = apiQuery.sex && apiQuery.sex !== 1 ? [sexLUT[apiQuery.sex]] : ["male", "female"];
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
        employment: employment,
        sex: sex,
        age: age,
        color: apiQuery.color,
        curve: apiQuery.curve
      };
      const queryWrapper = {
        "query": query,
        "selected": false,
        "modalVisible": false
      };

      queries.push(queryWrapper);
    }
    this.setState({ queries: queries });
  }

  async addQueryToBuilder(values) {
    const oldQueries = this.state.queries;
    const query = {
      "query": values,
      "selected": false,
      "modalVisible": false
    };
    if (this.queryExists(query, -1) === -1) {
      // need to save query id
      const qid = await this.saveQuery(query.query);
      query.query.qid = qid[0];
      oldQueries.push(query);
    }
    this.setState({
      modalVisible: false,
      queries: oldQueries
    })
  }

  async copyQueries() {
    const queries = this.state.queries;
    let result = '';
    let firstSelected = true
    for(let i = 0; i < queries.length; ++i){
      if(queries[i].selected){
        if(firstSelected) {
          firstSelected = !firstSelected;
          result += queries[i].query.qid
        } else {
          result += ", " + queries[i].query.qid
        }
      }
    }
    const message = "Select " + result + " from " + this.state.username 
    navigator.clipboard.writeText(message)
  }

  saveDto = async (query) => {
    console.log(query);
    // push to API
    const ret = await this.saveQuery(query);
    console.log(ret);
    if(ret) {
      let q = this.state.queries;
      // push to memory
      const index = q.findIndex((e) => e.query.qid === query.qid);
      q[index].query = query;
      this.setState({
        queries: q
      })
    }
  };

  async saveQuery(query) {
    const params = [];
    if (query.database === "education") {
      if (!query.education || query.education.length === 0 || query.education.length === 14) {
        params.push(1);
      } else {
        for (let i = 0; i < query.education.length; ++i) {
          params.push(educationLUTReverse[query.education[i]]);
        }
      }
    } else if (query.database === "employment") {
      if (!query.employment || query.employment.length === 0 || query.employment.length === 2) {
        params.push(1);
        params.push(2);
      } else {
        // length will be 1
        params.push(employmentLUTReverse[query.employment[0]]);
      }
    } else if (query.database === "income") {
      if (!query.income || query.income.length === 0 || query.income.length === 14) {
        params.push(1);
      } else {
        for (let i = 0; i < query.income.length; ++i) {
          params.push(incomeLUTReverse[query.income[i]]);
        }
      }
    }

    const apiQuery = [{
      "dataset": query.database,
      "params": params
    }];

    if (query.age && query.age.length > 1) {
      const age = [];
      for (let i = 0; i < query.age.length; ++i) {
        age.push(ageLUTReverse[query.age[i]]);
      }
      apiQuery[0].age = age;
    }
    else apiQuery[0].age = [1];
    if (query.sex && query.sex.length == 1) {
      apiQuery[0].sex = sexLUTReverse[query.sex[0]];
    } else apiQuery[0].sex = 1;
    if (query.qid) {
      apiQuery[0].qid = query.qid;
    }
    if(query.color) {
      apiQuery[0].color = query.color;
    }
    if(query.curve) {
      apiQuery[0].curve = query.curve;
    }
    return await Api.saveQuery(apiQuery);
  }

  async deleteQueries() {
    const queries = this.state.queries;
    const queriesToDelete = [];
    let size = queries.length;
    for (let i = 0; i < size; ++i) {
      if (queries[i].selected) {
        queriesToDelete.push(queries[i].query.qid);
        queries.splice(i, 1);
        --i;
        --size;
      }
    }
    this.setState({ queries: queries });
    await this.deleteQueriesAPI(queriesToDelete);
  }

  async deleteQueriesAPI(qids) {
    await Api.deleteQueries(qids);
  }

  async runQueries() {
    this.setState({ queryResults: [], isLoading: true });
    const queriesToRun = this.queriesSelected();
    const result = await Api.runQueries(queriesToRun);
    for (let i = 0; i < result.length; ++i) {
      if(i === 0) result[0].selected = true;
      else result[i].selected = false;

      result[i].qid = queriesToRun[i];
    }
    this.setState({ queryResults: result, isLoading: false });
  }

  toggleQuerySelected = (index) => {
    const queries = this.state.queries;
    queries[index].selected = !queries[index].selected;
    this.setState({ queries: queries });
  }

  toggleResultSelected = (index) => {
    const result = this.state.queryResults;
    result[index].selected = !result[index].selected;
    this.setState({ queryResults: result });
  }

  toggleModalVisible = (index) => {
    const queries = this.state.queries;
    queries[index].modalVisible = !queries[index].modalVisible;
    this.setState({ queries: queries });
  }

  queryExists = (query, index) => {
    const queries = this.state.queries;
    query = query.query;
    for (let i = 0; i < queries.length && i !== index; ++i) {
      const currQuery = queries[i].query
      if (query.database === currQuery.database &&
        query.sex === currQuery.sex &&
        query.income === currQuery.income &&
        query.education === currQuery.education &&
        query.employment === currQuery.employment &&
        query.age === currQuery.age) return i;
    }
    return -1;
  }

  querySelected = () => {
    for (let i = 0; i < this.state.queries.length; ++i) {
      if (this.state.queries[i].selected) return true;
    }
    return false;
  }

  buildQueryArrayHelper = (array) => {
    let str = "";
    for (let i = 0; i < array.length; ++i) {
      str += ` ${array[i]}`;
      if (i < array.length - 1) str += `,`;
    }
    return str;
  }

  buildQuery = query => {
    if (query !== undefined) {
      const { database, age, sex, employment, income, education } = query;
      let str = "";
      str += `Showing`;
      if (database === "employment") {
        if (!employment || employment.length == 0 || employment.length == 2) {
          str += ` total employment`;
        } else {
          str += this.buildQueryArrayHelper(employment);
        }
      } else if (database === "income") {
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
      if (sex && sex.length == 1) {
        str += ` where sex is `;
        str += this.buildQueryArrayHelper(sex);
      }

      if (sex && age && age.length > 0) {
        str += ' and';
      }

      if (age && age.length > 0) {
        str += ` where age is `;
        str += this.buildQueryArrayHelper(age);
      }
      return str;
    }
  }

  async shareMyQueries(queries){
    await Api.shareQueries(queries)
    this.setState({shareModalVisible: false})
  }

  queriesSelected(){
    const queries = this.state.queries;
    const result = [];
    let size = queries.length;
    for (let i = 0; i < size; ++i) {
      if (queries[i].selected) {
        result.push(queries[i].query.qid);
      }
    }
    return result;
  }

  onViewportChange = viewport => {
    const { width, height, ...etc } = viewport
    this.setState({ viewport: etc })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(this.state.queryResults) {
      var anyUpdated = false;
      let q = this.state.queryResults;
      for(var i = 0; i < q.length; i ++) {
        if(q[i].postSelect) {
          anyUpdated = true;
          q[i].selected = true;
          q[i].postSelect = false;
        }
      }
      if(anyUpdated)
        this.setState({queryResults: q});
    }
  }

  overrideColor = (qid, color) => {
    let overrides = {};
    if(this.state.overrides) {
      overrides = {...this.state.overrides};
    }
    overrides[qid] = color;
    console.log(overrides);
    this.setState({
      overrides: overrides
    });
  };

  colors = [
    [69, 195, 229],
    [229, 181, 69],
    [184, 69, 229],
    [147, 229, 69],
    [229, 93, 69],
    [229, 138, 69],
    [69, 229, 203]
  ];

  render() {
    const { viewport, data, allDay, selectedTime, startTime, endTime, mapStyle, isShowFirstLayer, isShowSecondLayer } = this.state;

    return (
      <Layout style={{ minHeight: '100%' }}>
        <CreateSearchQueryModal
          isCreate={true}
          visible={this.state.modalVisible}
          onCreate={(values) => {
            // default no sexes to both sexes
            if (typeof values.sex != 'undefined' && values.sex.length == 0) {
              values.sex = ["male", "female"];
            }
            this.addQueryToBuilder(values);

          }}
          onCancel={() => {
            this.setState({
              modalVisible: false
            })
          }}
        />
        <ShareQueryModal
            visible={this.state.shareModalVisible}
            queries={
              this.queriesSelected()
            }
            onCreate={(values) => {
              this.shareMyQueries(values);
        
            }}
            onCancel={() => {
              this.setState({
                shareModalVisible: false
              })
            }}
        />
        <Sider theme='light' collapsible={false} collapsed={false} width={400} style={{ padding: 20 }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <Title level={3}>Query Builder</Title>
            <Button type="dashed" onClick={() => this.setState({ modalVisible: true })} icon={<PlusOutlined />} />
            <Button type="dashed" disabled={!this.querySelected()} onClick={() => this.setState({ shareModalVisible: true })} icon={<ShareOutlined />} />
            <Button type="dashed" disabled={!this.querySelected()} onClick={() => this.deleteQueries()} icon={<DeleteOutlined />} />
            <Button type="dashed" loading={this.state.isLoading} disabled={!this.querySelected()} onClick={() => this.runQueries()} icon={<SearchOutlined />} />
            <br />
          </div>
          <List>
            {this.state.queries.map((query, index) => {
              return <div><CreateSearchQueryModal
                isCreate={false}
                visible={query.modalVisible}
                onCreate={(values) => {
                  const oldQueries = this.state.queries;
                  values.qid = oldQueries[index].query.qid;
                  oldQueries[index].query = values;
                  oldQueries[index].modalVisible = false;
                  // don't add if already exists
                  if (this.queryExists(oldQueries[index], index) !== -1) {
                    this.deleteQueries([oldQueries[index].query.qid]);
                    oldQueries.splice(index, 1);
                  } else {
                    this.saveQuery(oldQueries[index].query);
                  }
                  this.setState({
                    queries: oldQueries
                  })
                }}
                onCancel={() => {
                  this.toggleModalVisible(index);
                }}
                query={query.query}
              ></CreateSearchQueryModal>
                <List.Item><Checkbox checked={query.selected} onChange={() => this.toggleQuerySelected(index)}>
                  {this.buildQuery(query.query)} (Query <b>{query.query.qid}</b>)
                 </Checkbox><Button type="dashed" onClick={() => this.toggleModalVisible(index)} icon={<EditOutlined />} />
                </List.Item></div>
            })}
          </List>
  
        </Sider>
        <Layout>
          <Content>
            <div style={{ height: '100%', position: 'relative' }}>
              <ReactMapGL
                width='100%'
                height='100%'
                mapStyle={mapStyle}
                {...this.state.viewport}
                onViewportChange={viewport => this.onViewportChange(viewport)}
                mapboxApiAccessToken='pk.eyJ1IjoidHBpbnRvNyIsImEiOiJja2JicWYwMzkwM3NnMnNtZnZkbXU5dGhkIn0.NdzHwoMYvZ-fSTIA9xXXfw'

              >
              {this.state.queryResults.map((result) => (
                result.selected && (
                <Source id={"layer" + result.qid} type="geojson" data={result.layer}>
                <Layer id={"layer" + result.qid} {...result.heatmap} />
              </Source>)
              ))}  

              </ReactMapGL>
              <div className="control-panel">
                <h3>Heatmap</h3>

                <hr />
                {this.state.queryResults.map((result, index) => {
                  return <div>
                    <Checkbox checked={result.selected} onChange={() => this.toggleResultSelected(index)}>
                    </Checkbox> Query {result.qid}
                  </div>
                })}
              </div>
              <div className="map-legends">
                {this.state.queryResults.map((result, index) => {
                  if (result.selected) {
                    const obj = this.state.queries.find((e) => e.query.qid === result.qid);
                    if(obj) {
                        const dto = obj.query;
                        let color = result.hue;
                        if (dto && dto.color) {
                            let a = this.colors[dto.color];
                            color = `rgb(${a[0]},${a[1]},${a[2]})`
                        }
                        if (this.state.overrides && this.state.overrides[result.qid] !== undefined) {
                            let a = this.colors[this.state.overrides[result.qid]];
                            color = `rgb(${a[0]},${a[1]},${a[2]})`
                        }
                        return (
                            <Legend minimum={result.min} maximum={result.max} color={color} units={result.units}
                                    queryId={result.qid}/>
                        )
                    }
                    return (
                      <Legend minimum={result.min} maximum={result.max} color={color} units={result.units} queryId={result.qid} bezier={[0,0,1,1]} />
                    )
                  }
                })}
              </div>

                <div className="control-panel2">
                  <VisualQueryEditor queries={this.state.queryResults} dtos={this.state.queries}
                                     onChange={(queries) => {this.setState({queryResults: queries}); }}
                                     onColorChange={(qid, color) => this.overrideColor(qid, color)}
                                      onSaveDto={(query) => this.saveDto(query)}/>
                </div>
            </div>
          </Content>
        </Layout > 
      </Layout >
    );
  }
}
