import React from 'react';
import './KMapComponent.css';

import {convertSOPToMinTerms} from 'sop/SumOfProducts.js';

import GrayCode from 'util/GrayCode.js';
import {pastelColor} from 'util/ColorHelper.js';

class KMapComponent extends React.Component
{
  constructor()
  {
    super();

    this.inputHeader = "?/?";
    this.xHeaders = [];
    this.yHeaders = [];

    this.expressionTerms = [];
    this.expTerms = new Map();
    this.minTerms = new Map();
  }

  //Override
  componentWillMount()
  {
    const expression = this.props.src || 'BC\'D\' + AD\' + AC';
    const inputs = this.props.in || ['A', 'B', 'C', 'D'];

    if (inputs.length < 2) throw new Error("Does not support lesser than 2 inputs");
    if (inputs.length > 4) throw new Error("Does not support greater than 4 inputs");
    const bits = inputs.length;

    const xAxisBits = Math.ceil(bits / 2);
    const yAxisBits = bits - xAxisBits;
    const xAxisHeaders = Array.from(GrayCode(0, xAxisBits));
    const yAxisHeaders = Array.from(GrayCode(0, yAxisBits));

    const input = inputs.join('');
    this.inputHeader = input.substring(0, xAxisBits) + "/" + input.substring(xAxisBits);
    this.xHeaders = xAxisHeaders;
    this.yHeaders = yAxisHeaders;
    this.expTerms.clear();
    this.minTerms.clear();

    //Convert expression to minterms
    const terms = expression.replace(/\s/g,'').split('+');
    for(const term of terms)
    {
      const result = convertSOPToMinTerms(term, inputs);
      for(const minterm of result)
      {
        this.minTerms.set(minterm, '1');
      }
      this.expTerms.set(term, {color: pastelColor(), terms: result});
    }

    this.expressionTerms = terms;
  }

  //Override
  render()
  {
    const expression = this.props.src;
    const inputs = this.props.in;

    return <div className="kmap-container">
      <table className="kmap-table">
        <thead>
          <tr>
            <th>{this.inputHeader}</th>
            {
              this.xHeaders.map(e=><th key={e}>{e}</th>)
            }
          </tr>
        </thead>
        <tbody>
          {
            this.yHeaders.map(y => {
              return <tr key={y}>
                <th>{y}</th>
                {
                  this.xHeaders.map(x=><td key={x}>{this.minTerms.get(x + y) || '0'}</td>)
                }
              </tr>;
            })
          }
        </tbody>
      </table>
      <table className="kmap-key">
        <thead>
          <tr><th>Key</th></tr>
        </thead>
        <tbody>
          {
            this.expressionTerms.map(e=>
              <tr key={e}>
                <td>{e}: {this.expTerms.get(e).color}</td>
              </tr>)
          }
        </tbody>
      </table>
    </div>;
  }
}

export default KMapComponent;
