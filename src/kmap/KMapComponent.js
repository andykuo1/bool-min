import React from 'react';
import './KMapComponent.css';

import GrayCode from 'util/GrayCode.js';

const GROUP_BORDER_WIDTH = 2;
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

    this.targetGroup = null;
    this.targetGroups = [];
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
    this.inputHeader = input.substring(0, yAxisBits) + "/" + input.substring(yAxisBits);
    this.xHeaders = xAxisHeaders;
    this.yHeaders = yAxisHeaders;

    this.minGroups = new Map();
    this.expressionGroups.length = 0;
  }

  //Override
  componentDidUpdate()
  {
    const src = this.props.src;
    if (!this.tableElement) return;

    const tableRect = this.tableElement.getBoundingClientRect();

    this.minGroups.clear();
    this.expressionGroups.length = 0;

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
      if (!minTerms) console.log(expressionTerm, "does not have minterms????");
      const isEssential = minTerms ? minTerms.length <= 1 : false;
      for(const minTerm of minTerms)
      {
        const element = this.groupElements.get(minTerm);
        const rect = element.getBoundingClientRect();
        if (!this.minGroups.has(minTerm))
        {
          this.minGroups.set(minTerm, []);
        }
        const minGroup = this.minGroups.get(minTerm);

        /*
        if (rect.left > left) left = rect.left;
        if (rect.top > top) top = rect.top;
        if (rect.right < right) right = rect.right;
        if (rect.bottom < bottom) bottom = rect.bottom;
        */

        left = rect.left;
        right = rect.right;
        top = rect.top;
        bottom = rect.bottom;

        //Calculate expression group
        const expressionGroup = {
          term: expressionTerm,
          mterm: minTerm,
          x: left - tableRect.left,
          y: top - tableRect.top,
          width: right - left,
          height: bottom - top,
          offset: minGroup.length,
          color: group.color,
          essential: isEssential
        };

        minGroup.push(expressionGroup);
        this.expressionGroups.push(expressionGroup);
      }
    }
  }

  //Override
  render()
  {
    const src = this.props.src;

    return <div className="kmap-container" style={{position: "relative"}}>
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
              return <tr key={e}
                style={{background: this.targetGroups.length > 0 && !this.targetGroups.includes(e) ? "white" : group.color}}
                onMouseEnter={ev => this.targetGroups.push(e)}
                onMouseLeave={ev => this.targetGroups.length = 0}>
                <td>{e}</td>
              </tr>;
            })
          }
        </tbody>
      </table>
      {
        this.expressionGroups.map(e => <svg key={e.term + ":" + e.mterm}
          width={e.width} height={e.height}
          style={{position: "absolute", left: e.x, top: e.y, zIndex: e.offset}}>
          <rect className="expression-group"
            width={e.width} height={e.height}
            fill="rgba(0,0,0,0.03)" stroke={this.targetGroups.length > 0 && !this.targetGroups.includes(e.term) ? "white" : e.color}
            style={{strokeWidth: "0.5em", strokeDasharray: GROUP_BORDER_WIDTH + ", " + (e.offset * GROUP_BORDER_WIDTH)}}
            onMouseEnter={ev => {
              if (e.offset != 0) return;
              this.targetGroups.length = 0;
              src.getExpressionTermsByMinTerm(e.mterm, this.targetGroups);
            }}
            onMouseLeave={ev => {
              if (e.offset != 0) return;
              this.targetGroups.length = 0;
            }}/>
        </svg>)
      }
    </div>;
  }
}

export default KMapComponent;
