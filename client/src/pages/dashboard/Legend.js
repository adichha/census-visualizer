import React, { Component } from 'react';

export class Legend extends React.Component {
    interpolate = (num) => {
        const value = this.props.bezier[0]*Math.pow(num, 3) + this.props.bezier[1]*3*Math.pow(num, 2)*(1-num)
        + this.props.bezier[2]*3*num*(Math.pow((1-num), 2)) + this.props.bezier[3]*Math.pow((1-num), 3);
        return value;
    }

    render() {
        const { minimum, maximum, color, units, queryId, bezier } = this.props;
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
                {entries.map((value) => {
                    const x = this.interpolate(value)/this.interpolate(maximum);
                    console.log(x);
                    return (<h4><span style={{backgroundColor: color, opacity: x}}></span>{value}</h4>)
                })}
            </div>
            <p id="legend-units">{'All values in ' + units}</p>
        </div>
        )
    }
}