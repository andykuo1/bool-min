import React from 'react';
import { hot } from 'react-hot-loader';
import './App.css';

import QMMethod from 'qm/QMMethod.js';
import KMapComponent from 'kmap/KMapComponent.js';

class App extends React.Component
{
  constructor(props)
  {
    super(props);

    this.output = null;

    this.state = {
      mterms: "",
      dterms: ""
    };

    this.onMTermChange = this.onMTermChange.bind(this);
    this.onDTermChange = this.onDTermChange.bind(this);
    this.onSolveClick = this.onSolveClick.bind(this);
  }

  onMTermChange(e)
  {
    const value = e.target.value;
    this.setState({mvalue: value});
  }

  onDTermChange(e)
  {
    const value = e.target.value;
    this.setState({dvalue: value});
  }

  onSolveClick(e)
  {
    const mvalues = this.state.mvalue.split(',');
    const dvalues = this.state.dvalue.split(',');
    this.output = QMMethod(mvalues, dvalues).join(', ');
  }

  //Override
  render()
  {
    return <div className="app-container">
      <h1>Boolean Minimization</h1>
      <div>
        <label htmlFor="mterm-input">M Terms</label>
        <input id="mterm-input" onChange={this.onMTermChange}></input>
      </div>
      <div>
        <label htmlFor="dterm-input">D Terms</label>
        <input id="dterm-input" onChange={this.onDTermChange}></input>
      </div>
      <button id="solve-button" onClick={this.onSolveClick}>Solve</button>
      <hr/>
      <h2>{this.output}</h2>
      <KMapComponent/>
    </div>;
  }
}

//For hotloading this class
export default hot(module)(App);
