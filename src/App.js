import React, { Component } from 'react';
import './App.css';
import Ram from './Ram';
class App extends Component {
  render() {
    return (
      <div style={{width: "800px", height: "120px"}} className="App">
          <Ram memory={700} />
      </div>
    );
  }
}
export default App;
