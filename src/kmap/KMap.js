import {convertSOPToMinTerms} from 'sop/SumOfProducts.js';
import {pastelColor} from 'util/ColorHelper.js';

class KMap
{
  constructor(mterms, dterms)
  {
    this.mterms = mterms;
    this.dterms = dterms;

    this.bitCount = 0;
    this.groups = new Map();
    this.groupMapping = new Map();

    this.expression = [];
    this.inputs = [];
  }

  resolve(expression, inputs=null)
  {
    if (!inputs) inputs = getUsedInputsFromExpression(expression);
    if (inputs.length < 2) throw new Error("Does not support lesser than 2 inputs");
    if (inputs.length > 4) throw new Error("Does not support greater than 4 inputs");

    //Reset values
    this.bitCount = inputs.length;
    this.groups.length = 0;
    this.groupMapping.clear();

    //Convert expression to minterms
    const terms = expression.replace(/[^A-Z'+]/g,'').split('+');
    for(const term of terms)
    {
      const minTerms = [];
      const group = {
        term: term,
        color: pastelColor(),
        minTerms: minTerms
      }
      this.groups.set(term, group);

      const result = convertSOPToMinTerms(term, inputs);
      for(const bitTerm of result)
      {
        if (this.groupMapping.has(bitTerm))
        {
          this.groupMapping.get(bitTerm).push(term);
        }
        else
        {
          this.groupMapping.set(bitTerm, [term]);
        }
        minTerms.push(bitTerm);
      }
    }

    this.expression = terms;
    this.inputs = inputs;
  }

  getGroupByExpressionTerm(expressionTerm)
  {
    return this.groups.get(expressionTerm);
  }

  getMinTermsByExpressionTerm(expressionTerm)
  {
    return this.groups.get(expressionTerm).minTerms;
  }

  getGroupsByMinTerm(bitTerm, dst=[])
  {
    if (!this.groupMapping.has(bitTerm)) return dst;
    for(const e of this.groupMapping.get(bitTerm))
    {
      dst.push(this.groups.get(e));
    }
    return dst;
  }

  getExpressionTermsByMinTerm(bitTerm, dst=[])
  {
    if (!this.groupMapping.has(bitTerm)) return dst;
    for(const e of this.groupMapping.get(bitTerm))
    {
      dst.push(this.groups.get(e).term);
    }
    return dst;
  }

  isMinTerm(bitTerm)
  {
    return this.mterms.includes(parseInt(bitTerm, 2));
  }

  isDTerm(bitTerm)
  {
    return this.dterms.includes(parseInt(bitTerm, 2));
  }

  getExpression()
  {
    return this.expression;
  }

  getInputs()
  {
    return this.inputs;
  }

  getBitCount()
  {
    return this.bitCount;
  }
}

export function getUsedInputsFromExpression(expression)
{
  const inputs = expression.replace(/[^A-Z]+/g, '').split('');
  const result = new Set();
  for(const input of inputs)
  {
    if (input) result.add(input);
  }
  return Array.from(result);
}

export default KMap;
