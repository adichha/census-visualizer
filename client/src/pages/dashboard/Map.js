import React, { Component } from 'react';
import ReactMapGL, {Source, Layer} from 'react-map-gl';
import {heatmapLayer} from './map-style';
import ControlPanel from './control-panel';
import {json as requestJson} from 'd3-request';
import {Switch as Toggle} from 'antd';

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
  return {type: 'FeatureCollection', features};
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
      earthquakes: null,
      mapStyle: "mapbox://styles/mapbox/light-v9"
    };
  } 

  componentDidMount(){
    requestJson(
      'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson',
      (error, response) => {
        if (!error) {
          const features = response.features;
          const endTime = features[0].properties.time;
          const startTime = features[features.length - 1].properties.time;

          this.setState({
            data: response,
            earthquakes: response,
            endTime,
            startTime,
            selectedTime: endTime
          });
        }
      }
    );
  }

  toggleDarkMode = checked => {
    console.log(`checked = ${checked}`);
    if(checked){
      this.setState({mapStyle: "mapbox://styles/mapbox/dark-v9"})
    } else{
      this.setState({mapStyle: "mapbox://styles/mapbox/light-v9"}) 
    }
  }

  onViewportChange = viewport => {
    const { width, height, ...etc } = viewport
    this.setState({ viewport: etc })
  }

  _handleChangeDay = time => {
    this.setState({selectedTime: time});
    if (this.state.earthquakes) {
      this.setState({data: filterFeaturesByDay(this.state.earthquakes, time)});
    }
  };

  _handleChangeAllDay = allDay => {
    this.setState({allDay});
    if (this.state.earthquakes) {
      this.setState({
        data: allDay
          ? this.state.earthquakes
          : filterFeaturesByDay(this.state.earthquakes, this.state.selectedTime)
      });
    }
  };

  render() {
    const {viewport, data, allDay, selectedTime, startTime, endTime, mapStyle} = this.state;

    return (
      <div style={{ height: '100%', position: 'relative' }}>
        <ReactMapGL
          width='100%'
          height='100%'
          mapStyle={mapStyle}
          {...this.state.viewport}
          onViewportChange={viewport => this.onViewportChange(viewport)}
          mapboxApiAccessToken='pk.eyJ1IjoidHBpbnRvNyIsImEiOiJja2JicWYwMzkwM3NnMnNtZnZkbXU5dGhkIn0.NdzHwoMYvZ-fSTIA9xXXfw'
        >
        {data && (<Source type="geojson" data={data}>
          <Layer {...heatmapLayer} />
        </Source>)}
        
        {/* Control panel could be used to say filter the results of the feature by census year */}
        {/* <ControlPanel
          containerComponent={this.props.containerComponent}
          startTime={startTime}
          endTime={endTime}
          selectedTime={selectedTime}
          allDay={allDay}
          onChangeDay={this._handleChangeDay}
          onChangeAllDay={this._handleChangeAllDay}
        /> */}
        </ReactMapGL> 

        Dark Mode <Toggle onChange={this.toggleDarkMode} />
      </div>
    );
  }
}
