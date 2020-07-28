import React, { Component } from 'react';
import {Layout, Switch as Toggle} from 'antd';
export class Settings extends Component {
    constructor(props) {
      super(props);
      this.state = {
          mapStyle: "mapbox://styles/mapbox/dark-v9"
      }
    }  
    toggleDarkMode = checked => {
        console.log(`checked = ${checked}`);
        if (checked) {
          this.setState({ mapStyle: "mapbox://styles/mapbox/dark-v9" })
        } else {
          this.setState({ mapStyle: "mapbox://styles/mapbox/light-v9" })
        }
    }
    render(){
        return (
            <Layout style={{ minHeight: '100%' }}>
                 Dark Mode <Toggle style={{maxWidth: '25%'}} onChange={this.toggleDarkMode} />
            </Layout>
        );
    }
}