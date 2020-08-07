import React, { Component } from 'react';

export class Legend extends React.Component {
    render() {
        const { minimum, maximum, color, units, queryId } = this.props;
        let entries = []
        const scale = (maximum - minimum)/4;
        for (let i = maximum; i >= 0; i -= scale) {
            if (units != 'people') {
                entries.push(i.toFixed(2));
            }
            else {
                entries.push(Math.round(i));
            }
        }
        return (
        <div className="floatleft">
            <h4><span style={{backgroundColor: color}}></span>{'Query ' + queryId}</h4>
            <div id="state-legend" className="legend">
                {entries.map((value, idx) => (
                    <h4><span style={{backgroundColor: color, opacity: (entries.length - idx)/entries.length}}></span>{value}</h4>
                ))}
            </div>
            <p id="legend-units">{'All values in ' + units}</p>
        </div>
        )
    }
}