import React, { Component } from 'react';
import ReactMapGL, { Source, Layer } from 'react-map-gl';
import { heatmapLayer } from './map-style';
import ControlPanel from './control-panel';
import { json as requestJson } from 'd3-request';
import { List, Switch as Toggle, Layout, Typography, Button, Checkbox } from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined
} from '@ant-design/icons'
import { CreateSearchQueryModal } from './modal/CreateSearchQueryModal';
import { queries } from '@testing-library/react';

const { Sider, Content } = Layout;
const { Title } = Typography;


function filterFeaturesByDay(featureCollection, time) {
  const date = new Date(time);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const features = featureCollection.features.filter(feature => {
    const featureDate = new Date(feature.properties.time);
    return (
      featureDate.getFullYear() === year &&
      featureDate.getMonth() === month &&
      featureDate.getDate() === day
    );
  });
  return { type: 'FeatureCollection', features };
}

export class Map extends Component {
  constructor(props) {
    super(props);
    const current = new Date().getTime();
    this.state = {
      viewport: {
        latitude: 37.7577,
        longitude: -122.4376,
        zoom: 8
      },
      data: null,
      allDay: true,
      startTime: current,
      endTime: current,
      selectedTime: current,
      modalVisible: false,
      earthquakes: null,
      mapStyle: "mapbox://styles/mapbox/light-v9",
      isShowFirstLayer: true,
      isShowSecondLayer: false,
      queries: []
    };
  }

  componentDidMount() {
    requestJson(
      'https://api.jsonbin.io/b/5f0baf3f5d4af74b012b5873',
      (error, response) => {
        if (!error) {
          const features = response[0].features;
          // const endTime = features[0].properties.time;
          // const startTime = features[features.length - 1].properties.time;

          this.setState({
            data: response[0],
            earthquakes: response[0],
            // endTime,
            // startTime,
            // selectedTime: endTime
          });
        }
      }
    );
  }

  deleteQueries = () => {
    const queries = this.state.queries; 
    let size = queries.length;
    for(let i = 0; i < size; ++i){
      if(queries[i].selected){
        queries.splice(i, 1);
        --i;
        --size;
      }
    }
    this.setState({queries: queries});
  }

  toggleDarkMode = checked => {
    console.log(`checked = ${checked}`);
    if (checked) {
      this.setState({ mapStyle: "mapbox://styles/mapbox/dark-v9" })
    } else {
      this.setState({ mapStyle: "mapbox://styles/mapbox/light-v9" })
    }
  }

  toggleQuerySelected = (query) => {
    const index = this.queryExists(query, -1);
    if(index >= 0){
      const queries = this.state.queries;
      queries[index].selected = !queries[index].selected;
      this.setState({queries: queries});
    }
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
    this.setState({queries: queries});
  }

  queryExists = (query, index) => {
    const queries = this.state.queries;
    query = query.query;
    for(let i = 0; i < queries.length && i !== index; ++i){
      const currQuery = queries[i].query
      if(query.database === currQuery.database &&
        query.sex === currQuery.sex &&
        query.age_lower === currQuery.age_lower &&
        query.age_upper === currQuery.age_upper ) return i;
    }
    return -1;
  }

  querySelected = () => {
    for(let i = 0; i < this.state.queries.length; ++i){
      if(this.state.queries[i].selected) return true;
    }
    return false;
  }

  buildQuery = query => {
    const { database, age_lower, age_upper, sex } = query;
    let str = "";
    str += `Showing ${database}`;

    if (sex) {
      str += ` where sex is ${sex}`
    }

    if (sex && (age_lower || age_upper)) {
      str += ' and';
    }

    // make it lower range bound (15, 25, 35)
    if (age_lower || age_upper) {
      str += ` where age is between ${age_lower || 0} and ${age_upper || 100}`
    }
    return str;
  }

  onViewportChange = viewport => {
    const { width, height, ...etc } = viewport
    this.setState({ viewport: etc })
  }

  _handleChangeDay = time => {
    this.setState({ selectedTime: time });
    if (this.state.earthquakes) {
      this.setState({ data: filterFeaturesByDay(this.state.earthquakes, time) });
    }
  };

  _handleChangeAllDay = allDay => {
    this.setState({ allDay });
    if (this.state.earthquakes) {
      this.setState({
        data: allDay
          ? this.state.earthquakes
          : filterFeaturesByDay(this.state.earthquakes, this.state.selectedTime)
      });
    }
  };

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
            console.log(values);
            const oldQueries = this.state.queries;
            const query = {
              "query": values,
              "selected": false,
              "modalVisible": false
            };
            if(this.queryExists(query, -1) === -1){
              oldQueries.push(query);
            }
            this.setState({
              modalVisible: false,
              queries: oldQueries
            })
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
                oldQueries[index].query = values;
                oldQueries[index].modalVisible = false;
                // TODO: don't add if already exists
                if(this.queryExists(oldQueries[index], index) !== -1){
                  oldQueries.splice(index, 1);
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
            <List.Item><Checkbox checked={query.selected} onChange={() => this.toggleQuerySelected(query)}>{this.buildQuery(query.query)}</Checkbox>
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

                {isShowFirstLayer && isShowSecondLayer && data && (<Source type="geojson" data={data}>
                  {/* ... passes in the key value pairs as props to Layer */}
                  <Layer {...heatmapLayer} />
                  {/* <Layer {...heatmapLayer2} /> */}
                </Source>) ||
                  isShowFirstLayer && data && (<Source type="geojson" data={data}>
                    <Layer {...heatmapLayer} />
                  </Source>) ||
                  isShowSecondLayer && data && (<Source type="geojson" data={data}>
                    {/* <Layer {...heatmapLayer2} /> */}
                  </Source>)
                }
              </ReactMapGL>

              Dark Mode <Toggle onChange={this.toggleDarkMode} />
            </div>
          </Content>
        </Layout >
      </Layout >
    );
  }
}
