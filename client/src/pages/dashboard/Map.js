import React, { Component } from 'react';
import ReactMapGL, {Source, Layer} from 'react-map-gl';
import {heatmapLayer} from './map-style';
import {json as requestJson} from 'd3-request';

export class Map extends Component {

  state = {
    viewport: {
      latitude: 37.7577,
      longitude: -122.4376,
      zoom: 8
    },
    data: null
  };

  componentDidMount(){
    requestJson(
      'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson',
      (error, response) => {
        if (!error) {
          this.setState({
            data: response
          });
        }
      }
    );
  }

  onViewportChange = viewport => {
    const { width, height, ...etc } = viewport
    this.setState({ viewport: etc })
  }
  render() {
    const {data} = this.state
    return (
      <div style={{ height: '100%', position: 'relative' }}>
        <ReactMapGL
          width='100%'
          height='100%'
          {...this.state.viewport}
          onViewportChange={viewport => this.onViewportChange(viewport)}
          mapboxApiAccessToken='pk.eyJ1IjoidHBpbnRvNyIsImEiOiJja2JicWYwMzkwM3NnMnNtZnZkbXU5dGhkIn0.NdzHwoMYvZ-fSTIA9xXXfw'
        >
        {data && (<Source type="geojson" data={data}>
          <Layer {...heatmapLayer} />
        </Source>)}
        </ReactMapGL> 
      </div>
    );
  }
}
