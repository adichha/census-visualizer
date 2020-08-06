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
        return (
        <div>
            <h4><span style={{backgroundColor: color}}></span>Population</h4>
            <div id="state-legend" class="legend">
                {entries.map((value, idx) => (
                    <h4><span style={{backgroundColor: color, opacity: (entries.length - idx)/entries.length}}></span>{value}</h4>
                ))}
            </div>
            </div>
        )
    }
}