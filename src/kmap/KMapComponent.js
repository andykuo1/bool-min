import React from 'react';
import './KMapComponent.css';

import GrayCode from 'util/GrayCode.js';

class KMapComponent extends React.Component
{
  constructor(props)
  {
    super(props);

    this.inputHeader = "?/?";
    this.xHeaders = [];
    this.yHeaders = [];

    this.tableElement = null;
    this.groupElements = new Map();

    this.expressionGroups = [];
  }

  //Override
  componentWillMount()
  {
    const src = this.props.src;
    const bits = src.getBitCount();
    const inputs = src.getInputs();

    const xAxisBits = Math.ceil(bits / 2);
    const yAxisBits = bits - xAxisBits;
    const xAxisHeaders = Array.from(GrayCode(0, xAxisBits));
    const yAxisHeaders = Array.from(GrayCode(0, yAxisBits));

    const input = inputs.join('');
    this.inputHeader = input.substring(0, xAxisBits) + "/" + input.substring(xAxisBits);
    this.xHeaders = xAxisHeaders;
    this.yHeaders = yAxisHeaders;

    this.expressionGroups.length = 0;
  }

  //Override
  componentDidMount()
  {
    const src = this.props.src;
    const tableRect = this.tableElement.getBoundingClientRect();

    //Rebuild the expressionGroups
    for(const expressionTerm of src.getExpression())
    {
      let left = 0;
      let top = 0;
      let right = Infinity;
      let bottom = Infinity;

      //Get all elements related to expression term group
      const group = src.getGroupByExpressionTerm(expressionTerm);
      const minTerms = src.getMinTermsByExpressionTerm(expressionTerm);
      for(const minTerm of minTerms)
      {
        const element = this.groupElements.get(minTerm);
        const rect = element.getBoundingClientRect();
        if (rect.left > left) left = rect.left;
        if (rect.top > top) top = rect.top;
        if (rect.right < right) right = rect.right;
        if (rect.bottom < bottom) bottom = rect.bottom;
      }

      //Calculate expression group
      const expressionGroup = {
        term: expressionTerm,
        x: left,
        y: top,
        width: right - left,
        height: bottom - top,
        offset: this.expressionGroups.length,
        color: group.color
      };

      this.expressionGroups.push(expressionGroup);
    }
  }

  //Override
  render()
  {
    const src = this.props.src;

    return <div className="kmap-container">
      <table className="kmap-table" ref={ref=>this.tableElement=ref}>
        <thead>
          <tr>
            <th>{this.inputHeader}</th>
            {
              this.xHeaders.map(x => <th key={x}>{x}</th>)
            }
          </tr>
        </thead>
        <tbody>
          {
            this.yHeaders.map(y => {
              return <tr key={y}>
                <th>{y}</th>
                {
                  this.xHeaders.map(x => {
                    const bits = x + y;
                    const groups = src.getGroupsByMinTerm(bits);
                    const style = null;
                    return <td key={x} ref={ref=>this.groupElements.set(bits, ref)} style={style}>
                    {
                      src.isMinTerm(bits) ? '1' :
                      src.isDTerm(bits) ? 'X' :
                      '0'
                    }
                    </td>;
                  })
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
            src.getExpression().map(e => {
              const group = src.getGroupByExpressionTerm(e);
              return <tr key={e} style={{background: group.color}}>
                <td>{e}</td>
              </tr>;
            })
          }
        </tbody>
      </table>
      {
        this.expressionGroups.map(e => <svg key={e.term} width={e.width} height={e.height}
          style={{position: "fixed", left: e.x, top: e.y}}>
          <rect className="expression-group"
            width={e.width} height={e.height}
            fill="none" stroke={e.color}
            style={{strokeWidth: "0.5em", strokeDasharray: (5 + (e.offset * 2)) + ", 5"}}/>
        </svg>)
      }
    </div>;
  }
}

export default KMapComponent;
