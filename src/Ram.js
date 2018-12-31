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
            memsize: 0
        }
        this.addFirstFit = this.addFirstFit.bind(this);
        this.addBestFit = this.addBestFit.bind(this);
        this.addWorseFit = this.addWorseFit.bind(this);
        this.addNextFit = this.addNextFit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange({ target }) {
        this.setState({
          memsize: parseInt(target.value)
        });
      }    

    cleanRam(){

    }
    addFirstFit(){
        let tmp = this.state.data, memsize = this.state.memsize;
        if(memsize <= 0)
            return;
        for(let i = 0; i < tmp.length; i++){
            if(tmp[i].type === 0 && tmp[i].memory >= memsize){
                tmp[i].memory -= memsize;
                tmp.splice(i, 0, {type: this.state.processNum, memory: memsize});
                break;
            }
        }
        this.setState({data: tmp, processNum: this.state.processNum+1});
        console.log(this.state.data);
    }
    addBestFit(){

    }
    addWorseFit(){

    }
    addNextFit(){

    }
    renderControlPanel(){
        return(
            <div>
                Process Size: <input type="number" onChange={this.handleChange} value={this.state.memsize} /> <br/>
                <button onClick={this.addFirstFit}>First Fit</button>
                <button onClick={this.addBestFit}>Best Fit</button>
                <button onClick={this.addWorseFit}>Worse Fit</button>
                <button onClick={this.addNextFit}>Next Fit</button>
            </div>
        )
    }
    render() {
        return (
        <div style={{width: "800px", height: "120px"}} className="App">
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
                            key={index}
                            color={item.type? pallete[item.type % pallete.length] : "#f2f2f2"}
                            cluster="ram"
                            data={[{x: item.memory, y: 5}]}
                        />
                    ))
                }   
            </XYPlot>
        </div>
        );
    }
}
export default Ram;
