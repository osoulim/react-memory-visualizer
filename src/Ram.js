import React, { Component } from 'react';
import '../node_modules/react-vis/dist/style.css';
import {XYPlot, HorizontalBarSeries, VerticalGridLines, XAxis} from 'react-vis';

const data = [
  {x: 10, y: 5, label: "sag"},
];

class Ram extends Component {
    constructor(props){
        super(props);
        this.props = props;
        this.state = {
            data : [{name: 'free', memory: props.memory}]
        }
    }
    render() {
        return (
        <div style={{width: "800px", height: "120px"}} className="App">
            <XYPlot
                stackBy="x"
                xDomain={[0, this.props.memory]}
                yDomain={[0, 10]}
                height={120}
                width={800}
            >
                <VerticalGridLines />
                <XAxis />
                
                <HorizontalBarSeries
                    cluster="stack 1"
                    data={data}
                />
                
            </XYPlot>
        </div>
        );
    }
}
export default Ram;
