import React, { Component } from 'react';
import ReactMapGL, { Source, Layer } from 'react-map-gl';
import { heatmapLayer } from './map-style';
import { json as requestJson } from 'd3-request';
import { List, Switch as Toggle, Layout, Typography, Button, Checkbox } from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined
} from '@ant-design/icons'
import { CreateSearchQueryModal } from './modal/CreateSearchQueryModal';
import { queries } from '@testing-library/react';
import { Api } from '../../network/api/Api';
import './app.css';
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
  "market income" : 2,
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
  "malefemale" : 1,
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

export class Map extends Component {
  constructor(props) {
    super(props);
    const current = new Date().getTime();
    this.state = {
      viewport: {
        latitude: 43.4643,
        longitude: -80.5204,
        zoom: 8
      },
      data: null,
      allDay: true,
      startTime: current,
      endTime: current,
      selectedTime: current,
      modalVisible: false,
      earthquakes: null,
      mapStyle: "",
      isShowFirstLayer: true,
      isShowSecondLayer: false,
      queries: [],
      queryResults: []
    };
  }

  componentDidMount() {
    this.fetchData();
    this.setMapStyle();
  }

  async setMapStyle() {
    // TODO: when API is up
    const userInfo = await Api.getUserMe();
    if (userInfo && userInfo.dark_mode) {
      this.setState({ mapStyle: "mapbox://styles/mapbox/dark-v9" })
    } else {
      this.setState({ mapStyle: "mapbox://styles/mapbox/light-v9" })
    }
  }

  async fetchData() {
    const apiQueries = await Api.fetchAllQueries();
    console.log(apiQueries);
    // @TODO: Tyler: transform the return type from queries
    // into this.setState({ queries ....... })...
    let queries = [];
    for(let i = 0; i < apiQueries.length; ++i){
      // note: need to deal w query exists?
      const apiQuery = apiQueries[i];
      const education = [];
      const income = [];
      let sex = [];
      const age = [];
      if(!(apiQuery.params.length == 1 && apiQuery.params[0] == 1)){
        if(apiQuery.dataset === "education"){

          for(let j = 0; j < apiQuery.params.length; ++j){
            education.push(educationLUT[apiQuery.params[j]]);
          }
        } else if(apiQuery.dataset === "employment"){
          for(let j = 0; j < apiQuery.params.length; ++j){
            income.push(incomeLUT[apiQuery.params[j]]);
          }
        }
      }
      sex = apiQuery.sex && apiQuery.sex !== 1 ? [sexLUT[apiQuery.sex]] : ["male", "female"];
      // TODO: i should not be storing malefemale 
      if(apiQuery.age){
        for(let j = 0; j < apiQuery.age.length; ++j){
          if(apiQuery.age[j] !== 1){
            age.push(ageLUT[apiQuery.age[j]]);
          }
        }
      }
      // TODO: need to fix age in query builder
      const query = {
        qid: apiQuery.qid,
        database: apiQuery.dataset,
        education: education,
        income: income, 
        sex: sex, 
        age: age
      };
      const queryWrapper = {
        "query": query,
        "selected": false,
        "modalVisible": false
      };
      
      queries.push(queryWrapper);
    }
    this.setState({ queries: queries });
    console.log(this.state.queries);
  }

  async addQueryToBuilder(values){
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

  async saveQuery(query){
    const params = [];
    // TODO: if all length or none, do total. 
    if(query.database === "education"){
      if(!query.education || query.education.length == 0  || query.education.length == 14){
        params.push(1);
      } else{
        for(let i = 0; i < query.education.length; ++i){
          params.push(educationLUTReverse[query.education[i]]);
        }
      }
    } else if(query.database === "employment"){
      if(!query.income || query.income.length == 0  || query.income.length == 14){
        params.push(1);
      } else{
        for(let i = 0; i < query.income.length; ++i){
          params.push(incomeLUTReverse[query.income[i]]);
        }
      }
    }
    const apiQuery = [{
      "dataset": query.database,
      "params": params,
    }];
    if(query.age && query.age.length > 1){
      const age = [];
      for(let i = 0; i < query.age.length; ++i){
        age.push(ageLUTReverse[query.age[i]]);
      }
      apiQuery[0].age = age;
    }
    else apiQuery[0].age = [1];
    if(query.sex && query.sex.length == 1){
      apiQuery[0].sex = sexLUTReverse[query.sex[0]];
    } else apiQuery[0].sex = 1;
    console.log(query);
    if(query.qid){
      apiQuery[0].qid = query.qid;
    }
    console.log(apiQuery);
    let data = await Api.saveQuery(apiQuery);
    console.log("daokdaodka");
    console.log(data);
    return data;
  }

  async deleteQueries(){
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

  async deleteQueriesAPI(qids){
    console.log(qids);
    await Api.deleteQueries(qids);
  }

  async runQueries(){
    this.setState({queryResults: []});
    const queries = this.state.queries;
    const queriesToRun = [];
    let size = queries.length;
    for (let i = 0; i < size; ++i) {
      if (queries[i].selected) {
        console.log(queries[i].query.qid);
        queriesToRun.push(queries[i].query.qid);
      }
    }
    console.log("run queries");
    console.log(queriesToRun);
    const result = await Api.runQueries(queriesToRun);
    result[0].selected = true;
    let val = 0;
    for(let i = 0; i < result[0].features.length; ++i){
      val += result[0].features[i].properties.mag;
    }
    console.log(val);
    for(let i = 1; i < result.length; ++i){
      result[i].selected = false;
    }
    console.log(result)
    this.setState({queryResults: result});
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

  toggleIsShowFirstLayer = checked => {
    this.setState({ isShowFirstLayer: !checked });
  }

  toggleIsShowSecondLayer = checked => {
    this.setState({ isShowSecondLayer: !checked });
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
        query.income == currQuery.income &&
        query.education == currQuery.education &&
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
    if(query !== undefined){
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
        if(sex.length == 0){
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

  onViewportChange = viewport => {
    const { width, height, ...etc } = viewport
    this.setState({ viewport: etc })
  }

  // TODO : execute
  // query (POST)
  // user/query_by_id 
  // pass in by qid (array) -> list 
  // returns a geojson 

  // TODO : friends pages
  // find profiles
  // add friends
  // list friends

  // TODO : user profile page

  render() {
    const { viewport, data, allDay, selectedTime, startTime, endTime, mapStyle, isShowFirstLayer, isShowSecondLayer } = this.state;

    let heatmapLayer2 = heatmapLayer
    // heatmapLayer2.paint["heatmap-color"] = [
    //   'interpolate',
    //   ['linear'],
    //   ['heatmap-density'],
    //   0,
    //   'rgba(33,102,172,0)',
    //   0.2,
    //   'rgb(11, 64, 8)',
    //   0.4,
    //   'rgb(29, 89, 25)',
    //   0.6,
    //   'rgb(34, 181, 24)',
    //   0.8,
    //   'rgb(111, 217, 104)',
    //   0.9,
    //   'rgb(165, 230, 161)'
    // ]
    return (
      <Layout style={{ minHeight: '100%' }}>
        <CreateSearchQueryModal
          isCreate={true}
          visible={this.state.modalVisible}
          onCreate={(values) => {
            // default no sexes to both sexes
            if(typeof values.sex != 'undefined' && values.sex.length == 0){
              values.sex = ["male", "female"];
            }
            console.log(values);
            this.addQueryToBuilder(values);

          }}
          onCancel={() => {
            this.setState({
              modalVisible: false
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
            <Button type="dashed" disabled={!this.querySelected()} onClick={() => this.deleteQueries()} icon={<DeleteOutlined />} />
            <Button type="dashed" disabled={!this.querySelected()} onClick={() => this.runQueries()} icon={<SearchOutlined />} />
            <br />
          </div>
          <List>
            {this.state.queries.map((query, index) => {
              return <div><CreateSearchQueryModal
                isCreate={false}
                visible={query.modalVisible}
                onCreate={(values) => {
                  console.log(values);
                  const oldQueries = this.state.queries;
                  values.qid = oldQueries[index].query.qid;
                  oldQueries[index].query = values;
                  oldQueries[index].modalVisible = false;
                  // don't add if already exists
                  if (this.queryExists(oldQueries[index], index) !== -1) {
                    this.deleteQueries([oldQueries[index].query.qid]);
                    oldQueries.splice(index, 1);
                    // TODO: call deleteQuery
                  } else {
                    // TODO: should update instead of creating a new one 
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
                <List.Item><Checkbox checked={query.selected} onChange={() => this.toggleQuerySelected(index)}>{this.buildQuery(query.query)}</Checkbox>
                  <Button type="dashed" onClick={() => this.toggleModalVisible(index)} icon={<EditOutlined />} />
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
                <Source type="geojson" data={result}>
                {/* ... passes in the key value pairs as props to Layer */}
                <Layer {...heatmapLayer} />
                {/* <Layer {...heatmapLayer2} /> */}
              </Source>)
              ))}  

              </ReactMapGL>
              <div className="control-panel">
        <h3>Heatmap</h3>
      
        <hr />
        {this.state.queryResults.map((result, index) => {
        return <div>Test test
        <Checkbox checked={result.selected} onChange={() => this.toggleResultSelected(index)}>{}
          {/* TODO: what should be printed here (entire query is too long, maybe qid?) */}
        </Checkbox></div>
      })}
      </div>
            </div>
          </Content>
        </Layout >
      </Layout >
    );
  }
}
