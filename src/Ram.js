import React, { Component } from 'react';
import '../node_modules/react-vis/dist/style.css';
import {XYPlot, HorizontalBarSeries, VerticalGridLines, XAxis} from 'react-vis';

const pallete=['#776E57', '#12939A', '#17B8BE', '#F6D18A', '#B7885E', '#FFCB99', '#F89570', '#829AE3', '#E79FD5', '#1E96BE', '#89DAC1', '#B3AD9E'];

class Ram extends Component {
    constructor(props){
        super(props);
        this.props = props;
        this.state = {
            data : [{type : 0, memory: props.memory}],
            processNum: 1,
            lastFit: 0,
            memsize: 0,
            endProcess: -1,
            label: {type : 0, memory: props.memory},
        }
        this.addFirstFit = this.addFirstFit.bind(this);
        this.addBestFit = this.addBestFit.bind(this);
        this.addWorstFit = this.addWorstFit.bind(this);
        this.addNextFit = this.addNextFit.bind(this);
        this.finishProcess = this.finishProcess.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
    }

    handleChange({ target }) {
        this.setState({
          memsize: parseInt(target.value)
        });
    }    

    handleSelectChange({ target }) {
        this.setState({
            endProcess: parseInt(target.value)
        });
    }    

    addFirstFit(){
        let tmp = this.state.data, memsize = this.state.memsize;
        if(memsize <= 0)
            return;
        for(var i = 0; i < tmp.length; i++){
            if(tmp[i].type === 0 && tmp[i].memory >= memsize){
                tmp[i].memory -= memsize;
                tmp.splice(i, 0, {type: this.state.processNum, memory: memsize});
                break;
            }
        }
        this.setState({data: tmp, processNum: this.state.processNum+1, lastFit: i});
        this.cleanRam();
    }

    addBestFit(){
        let tmp = this.state.data, memsize = this.state.memsize;
        if(memsize <= 0)
            return;
        let putIndex = -1, putSize = Infinity;
        for(let i = 0; i < tmp.length; i++){
            if(tmp[i].type === 0 && tmp[i].memory >= memsize && tmp[i].memory < putSize){
                putIndex = i;
                putSize = tmp[i].memory;
            }
        }
        if(putIndex === -1)
            return;
        tmp[putIndex].memory -= memsize;
        tmp.splice(putIndex, 0, {type: this.state.processNum, memory: memsize});
        this.setState({data: tmp, processNum: this.state.processNum+1, lastFit: putIndex});
        this.cleanRam();
    }
    addWorstFit(){
    let tmp = this.state.data, memsize = this.state.memsize;
        if(memsize <= 0)
            return;
        let putIndex = -1, putSize = 0;
        for(let i = 0; i < tmp.length; i++){
            if(tmp[i].type === 0 && tmp[i].memory >= memsize && tmp[i].memory > putSize){
                putIndex = i;
                putSize = tmp[i].memory;
            }
        }
        if(putIndex === -1)
            return;
        tmp[putIndex].memory -= memsize;
        tmp.splice(putIndex, 0, {type: this.state.processNum, memory: memsize});
        this.setState({data: tmp, processNum: this.state.processNum+1, lastFit:putIndex});
        this.cleanRam();
    }

    addNextFit(){
        let tmp = this.state.data, memsize = this.state.memsize;
        if(memsize <= 0)
            return;
        for(var i = (this.state.lastFit + 1) % tmp.length; i !== this.state.lastFit; i = (i + 1) % tmp.length){
            if(tmp[i].type === 0 && tmp[i].memory >= memsize){
                tmp[i].memory -= memsize;
                tmp.splice(i, 0, {type: this.state.processNum, memory: memsize});
                break;
            }
        }
        this.setState({data: tmp, processNum: this.state.processNum+1, lastFit: i});
        this.cleanRam();
    }

    finishProcess(){
        let endProcess = this.state.endProcess, tmp = this.state.data;
        if(endProcess <= 0)
            return;
        for(let i = 0; i < tmp.length; i++){
            if(tmp[i].type === endProcess)
                tmp[i].type = 0;
        }
        this.setState({data: tmp});
        this.cleanRam();
    }

    cleanRam(){
        let tmp = this.state.data;
        for(let i = 0; i < tmp.length-1; i++){
            if(tmp[i].memory === 0){
                tmp.splice(i, 1);
                i--;
                continue;
            }
            if(tmp[i].type === 0 && tmp[i+1].type === 0){
                tmp[i].memory += tmp[i+1].memory;
                tmp.splice(i+1, 1);
                i--;
                continue;
            }
        }
        if(tmp[tmp.length - 1].memory === 0)
            tmp.splice(tmp.length - 1, 1);
        this.setState({data: tmp});
        console.log(this.state.data);
    }
    
    renderControlPanel(){
        return(
            <div>
                <div>
                    Process Size: <input type="number" onChange={this.handleChange} value={this.state.memsize} /> <br/>
                    <button onClick={this.addFirstFit}>First Fit</button>
                    <button onClick={this.addBestFit}>Best Fit</button>
                    <button onClick={this.addWorstFit}>Worst Fit</button>
                    <button onClick={this.addNextFit}>Next Fit</button>
                </div>
                <div>
                    <select value={this.state.endProcess} onChange={this.handleSelectChange}>
                        <option value={-1}>please select process</option>
                        {
                            this.state.data.filter(item => item.type > 0).map((item, index) => (
                                <option key={index} value={item.type}>Process {item.type}</option>
                                ))
                        }
                    </select>
                    <button onClick={this.finishProcess} >Has Been Finished</button>
                </div>
            </div>
        )
    }
    render() {
        return (
        <div style={{width: "100%", borderColor:"black", borderStyle:"solid", borderWidth: "5px", padding:"20px", margin:"20px"}} >
            {this.renderControlPanel()}
            <XYPlot
                stackBy="x"
                xDomain={[0, this.props.memory]}
                yDomain={[0, 10]}
                height={120}
                width={800}
            >
                <VerticalGridLines />
                <XAxis />
                {
                    this.state.data.map((item, index) =>(    
                            <HorizontalBarSeries
                                onValueMouseOver={(point, event)=>{
                                    this.setState({label: point.extra})
                                }}
                                key={index}
                                color={item.type? pallete[item.type % pallete.length] : "#f2f2f2"}
                                cluster="ram"
                                data={[{x: item.memory, y: 5, extra: item}]}
                            />
                    ))
                }   
            </XYPlot>
            <div>
                {this.state.label.type ? "process " + this.state.label.type : "free space"} : {this.state.label.memory}
            </div>
        </div>
        );
    }
}
export default Ram;
