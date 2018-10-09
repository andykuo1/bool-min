export function convertSOPToMinTerms(sop, inputs=null, dst=[])
{
  if (inputs == null)
  {
    inputs = getUsedInputsFromExpression(sop);
  }

  const terms = sop.replace(/\s/g).split('+');
  for(const term of terms)
  {
    convertSOPTermToMinTerms(term, inputs, dst);
  }

  return dst;
}

function convertSOPTermToMinTerms(term, inputs, dst)
{
  const bitCount = inputs.length;
  let bits = new Array(bitCount);
  bits.fill(-1);

  let prevIndex = bits.length;
  let termInput;
  for (let i = 0, l = term.length; i < l; ++i)
  {
    termInput = term.charAt(i);
    //It's a not bar!
    if (termInput == '\'')
    {
      bits[prevIndex] = 0;
    }
    //It's an input var!
    else
    {
      prevIndex = inputs.indexOf(termInput);
      if (prevIndex < 0) throw new Error("Found unlisted input \'" + termInput + "\' in expression");
      bits[prevIndex] = 1;
    }
  }

  //Make sure all varyied minterms are also added
  const subterms = [bits];
  while(subterms.length > 0)
  {
    let subterm;
    bits = subterms.pop();
    for(let i = 0, l = bits.length; i < l; ++i)
    {
      //If it can be either 0 or 1, get both
      if (bits[i] == -1)
      {
        bits[i] = 0;

        subterm = bits.slice();
        subterm[i] = 1;
        subterms.push(subterm);
      }
    }

    dst.push(bits.join(''));
  }
}

export function getUsedInputsFromExpression(expression)
{
  const inputs = expression.replace(/[+'\s]/g).split('');
  const result = new Set();
  for(const input of inputs)
  {
    result.add(input);
  }
  return Array.from(result);
}
