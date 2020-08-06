import React, { Component } from 'react';
import './editor.css';
import BezierEditor from "bezier-easing-editor";
import {Button, Radio, Select} from "antd";
import {UserStore} from "../../stores/UserStore";

export class VisualQueryEditor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            curve: [0, 0, 1, 1],
            color: null,
            selected: null
        };
    }

    componentWillReceiveProps(nextProps, nextContext) {
        // if selected is null, set to first one
        if(!this.state.selected && nextProps.queries.length !== 0) {
            this.setState({selected: nextProps.queries[0].qid})
            // TODO: update curves
        } else if(this.state.selected && nextProps.queries.length === 0) {
            this.setState({selected: null})
        }
    }

    hslToRgb(h, s, l){
        var r, g, b;

        if(s == 0){
            r = g = b = l; // achromatic
        }else{
            var hue2rgb = function hue2rgb(p, q, t){
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    makeNewColors(c) {
        let r = c[0];
        let g = c[1];
        let b = c[2];
        // let r = 0, g = 0, b = 0;
        return [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0,
            `rgba(${r},${g},${b},0)`,
            0.2,
                `rgba(${r},${g},${b},0.2)`,
            0.4,
                `rgba(${r},${g},${b},0.4)`,
            0.6,
                `rgba(${r},${g},${b},0.6)`,
            0.8,
                `rgba(${r},${g},${b},0.8)`,
            0.9,
                `rgba(${r},${g},${b},1)`,
        ];
    }

    componentWillUpdate(nextProps, nextState, nextContext) {
        // update curve on new selected query
        if(this.state.selected !== nextState.selected) {
            // update curve and color
            if(nextState.selected) {
                const q = this.props.queries[nextState.selected];
                if(!q) return;
                // fetch from query
                this.setState({
                    color: q.color,
                    curve: (q.curve) ? q.curve : [0, 0, 1, 1]
                })
            } else {
                // nothing selected; null out
                this.setState({
                    color: null,
                    curve: [0, 0, 1, 1]
                })
            }
        }
    }

    colors = [
        [69, 195, 229],
        [229, 181, 69],
        [184, 69, 229],
        [147, 229, 69],
        [229, 93, 69],
        [229, 138, 69],
        [69, 229, 203]
    ];

    changeColor = (colorIndex) => {
        if(this.state.selected) {
            this.setState({color: colorIndex});
            let q = this.props.queries;
            let index = q.findIndex((e) => e.qid === this.state.selected);
            q[index].heatmap.paint["heatmap-color"] = this.makeNewColors(this.colors[parseInt(colorIndex)]);
            q[index].selected = false;
            q[index].postSelect = true;
            this.props.onChange(q);
        }
    };

    changeCurve = (curve) => {
        if(this.state.selected) {
            this.setState({curve: curve});


            let q = this.props.queries;
            let index = q.findIndex((e) => e.qid === this.state.selected);

            const max = (a, b) => {if(a > b) return a; else return b;};
            const min = (a, b) => {if(a < b) return a; else return b;};

            const mag = q[index].heatmap.paint["heatmap-weight"][5];
            const weight = ["interpolate", ["cubic-bezier", max(curve[0], 0), max(curve[1], 0), min(curve[2], 1), min(curve[3], 1)], ["get", "mag"], 0, 0, mag, 1];

            q[index].heatmap.paint["heatmap-weight"] = weight;
            q[index].selected = false;
            q[index].postSelect = true;
            this.props.onChange(q);
        }

    };

    resetCurve = () => {
      this.changeCurve([0, 0, 1, 1]);
    };

    save = () => {
        if(this.state.selected) {
            // TODO: save
        }
    };

    render() {
        return (
            <div className="editor-base">
                <h3>Edit query visuals</h3>
                <span>Query</span>
                <Select value={this.state.selected} onChange={val => this.setState({selected: val})}>
                    {
                        this.props.queries.map(q => (
                            <Select.Option value={q.qid}>
                                Query {q.qid}
                            </Select.Option>
                        ))
                    }
                </Select>
                <span>Color</span>
                <Radio.Group style={{display: "inline-flex", direction: "row"}} value={this.state.color} onChange={ev => this.changeColor(ev.target.value)}>
                    <Radio.Button value="0" style={{padding: 0}}><div className="swatch1"/></Radio.Button>
                    <Radio.Button value="1" style={{padding: 0}}><div className="swatch2"/></Radio.Button>
                    <Radio.Button value="2" style={{padding: 0}}><div className="swatch3"/></Radio.Button>
                    <Radio.Button value="3" style={{padding: 0}}><div className="swatch4"/></Radio.Button>
                    <Radio.Button value="4" style={{padding: 0}}><div className="swatch5"/></Radio.Button>
                    <Radio.Button value="5" style={{padding: 0}}><div className="swatch6"/></Radio.Button>
                </Radio.Group>
                <span>Data curve</span>
                <BezierEditor className="editor" value={this.state.curve}
                              onChange={val => this.changeCurve(val)}
                              width={200}
                              height={200}
                              handleColor="#1890ff"

                />
                <Button onClick={this.resetCurve} style={{marginBottom: 8, marginTop: 4}}>Reset Curve</Button>
                <Button type="primary" onClick={this.save}>Save</Button>
            </div>
        );
    }
}