import React from 'react';
import { hot } from 'react-hot-loader';
import './App.css';

import QMMethod from 'qm/QMMethod.js';
import KMap from 'kmap/KMap.js';

import KMapComponent from 'kmap/KMapComponent.js';

class App extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      mvalue: '', dvalue: '',
      solution: null,
      kmap: null
    };

    this.onMChange = this.onMChange.bind(this);
    this.onMBlur = this.onMBlur.bind(this);

    this.onDChange = this.onDChange.bind(this);
    this.onDBlur = this.onDBlur.bind(this);

    this.onSolve = this.onSolve.bind(this);
  }

  onMChange(e)
  {
    const value = e.target.value.replace(/[^0-9,]/g,'');
    this.setState({mvalue: value});
  }

  onMBlur(e)
  {
    const values = e.target.value.split(',');
    const result = [];
    for(const value of values)
    {
      if (value) result.push(value);
    }
    this.setState({mvalue: result.join(',')});
  }

  onDChange(e)
  {
    const value = e.target.value.replace(/[^0-9,]/g,'');
    this.setState({dvalue: value});
  }

  onDBlur(e)
  {
    const values = e.target.value.split(',');
    const result = [];
    for(const value of values)
    {
      if (value) result.push(value);
    }
    this.setState({dvalue: result.join(',')});
  }

  onSolve(e)
  {
    document.activeElement.blur();

    const mterms = [];
    for(const term of this.state.mvalue.split(','))
    {
      if (term)
      {
        mterms.push(parseInt(term));
      }
    }

    if (mterms.length > 0)
    {
      const dterms = [];
      for(const term of this.state.dvalue.split(','))
      {
        if (term)
        {
          dterms.push(parseInt(term));
        }
      }

      const solution = QMMethod(mterms, dterms).sort();
      const kmap = new KMap(mterms, dterms);
      const expression = solution.join('+');
      kmap.resolve(expression);

      this.setState({
        solution: expression,
        kmap: kmap
      });
    }
  }

  //Override
  render()
  {
    return <div className="app-container">
      <h1>Boolean Minimization</h1>
      <label htmlFor="mterm-input">{"Min Terms:"}</label>
      <input id="mterm-input" value={this.state.mvalue} onChange={this.onMChange} onBlur={this.onMBlur}/>
      <label htmlFor="dterm-input">{"D Terms:"}</label>
      <input id="dterm-input" value={this.state.dvalue} onChange={this.onDChange} onBlur={this.onDBlur}/>

      <button onClick={this.onSolve}>Solve</button>

      {
        this.state.solution &&
        <KMapComponent src={this.state.kmap}/>
      }

      <h2>
        <label>Output: </label>
        <span>{this.state.solution || '???'}</span>
      </h2>
    </div>;
  }
}

//For hotloading this class
export default hot(module)(App);
