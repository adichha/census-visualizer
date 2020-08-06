import React, { Component } from 'react';

const minimum = 0

export class Legend extends React.Component {
    render() {
        const { maximum, granularity, color } = this.props;
        let entries = []
        for (let i = maximum; i >= 0; i -= granularity) {
            entries.push(i);
        }
        console.log(entries)
        // return (
        //     <div id="state-legend" class="legend">
        //         <h4><span style={{backgroundColor: "#723122"}}></span>Population</h4>
        //         <div><span style={{backgroundColor: "#723122"}}></span>25,000,000</div>
        //         <div><span style={{backgroundColor: "#723122"}}></span>10,000,000</div>
        //         <div><span style={{backgroundColor: "#723122"}}></span>7,500,000</div>
        //         <div><span style={{backgroundColor: "#723122"}}></span>5,000,000</div>
        //         <div><span style={{backgroundColor: "#723122"}}></span>2,500,000</div>
        //         <div><span style={{backgroundColor: "#723122"}}></span>1,000,000</div>
        //         <div><span style={{backgroundColor: "#723122"}}></span>750,000</div>
        //         <div><span style={{backgroundColor: "#723122"}}></span>500,000</div>
        //         <div>0</div>
        //     </div>
        // )
        return (
        <div>
            <h4><span style={{backgroundColor: "#723122"}}></span>Population</h4>
            <div id="state-legend" class="legend">
                {entries.map((idx) => (
                    <h4><span style={{backgroundColor: "#723122"}}></span>{idx}</h4>
                ))}
            </div>
            </div>
        )
    }
}