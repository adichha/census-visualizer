import React, { Component } from 'react';
import ReactMapGL from 'react-map-gl';

export class Map extends Component {

  state = {
    viewport: {
      latitude: 37.7577,
      longitude: -122.4376,
      zoom: 8
    }
  };


  onViewportChange = viewport => {
    const { width, height, ...etc } = viewport
    this.setState({ viewport: etc })
  }
  render() {
    return (
      <div style={{ height: '100%', position: 'relative' }}>
        <ReactMapGL
          width='100%'
          height='100%'
          {...this.state.viewport}
          onViewportChange={viewport => this.onViewportChange(viewport)}
          mapboxApiAccessToken='pk.eyJ1IjoidHBpbnRvNyIsImEiOiJja2JicWYwMzkwM3NnMnNtZnZkbXU5dGhkIn0.NdzHwoMYvZ-fSTIA9xXXfw'
        />
      </div>
    );
  }
}
