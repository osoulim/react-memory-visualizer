import React, { Component } from 'react';
import './App.css';
import Ram from './Ram';
class App extends Component {
  constructor(){
      super();
      this.state = {
        memorySize: 0,
        memoryField: 1024,
      }
      this.handleChange = this.handleChange.bind(this);
      this.createRam = this.createRam.bind(this);
  }

  handleChange({ target }) {
    this.setState({
      memoryField: parseInt(target.value)
    });
  }   

  createRam(){
      this.setState({
        memorySize: this.state.memoryField
      });
  }

  render() {
    return (
      <div style={{width: "800px", height:"100%", margin:"auto", marginTop:"120px"}} className="App">
      <input type="number" value={this.state.memoryField} onChange={this.handleChange} />
      <button onClick={this.createRam}>Create Ram</button>
          { !!this.state.memorySize && <Ram key={this.state.memorySize} memory={this.state.memorySize} />}
      </div>
    );
  }
}
export default App;
