import React, { Component } from 'react';

export class Legend extends React.Component {
    render() {
        const { minimum, maximum, color, units, queryId } = this.props;
        let entries = []
        const scale = (maximum - minimum)/4;
        for (let i = maximum; i >= 0; i -= scale) {
            entries.push(i);
        }
        console.log(entries)
        return (
        <div>
            <h4><span style={{backgroundColor: color}}></span>{'QID: ' + queryId}</h4>
            <div id="state-legend" class="legend">
                {entries.map((value, idx) => (
                    <h4><span style={{backgroundColor: color, opacity: (entries.length - idx)/entries.length}}></span>{value}</h4>
                ))}
            </div>
            <p id="legend-units">{'All units in ' + units}</p>
        </div>
        )
    }
}