var OneGroups = function()
{
  this.groups = [];
  this.addGroup = function(onegroup) {
    for(var i = 0, len = onegroup.groups.length; i < len; ++i)
    {
      if (typeof onegroup.groups[i] == 'undefined') continue;
      if (typeof this.groups[i] == 'undefined')
      {
        this.groups[i] = [];
      }
      this.groups[i] = this.groups[i].concat(onegroup.groups[i]);
    }
  };
  this.getGroup = function(ones) {
    var g = this.groups[ones];
    if (typeof g == 'undefined')
    {
      g = [];
      g.name = "G" + ones;
    }
    return g;
  }
  this.addToGroup = function(ones, bitterm) {
    var g = this.groups[ones];
    if (!g) g = (this.groups[ones] = []);
    g.push(bitterm);
    return g;
  }
  this.size = function() {
    return this.groups.length;
  };
  this.isEmpty = function() {
    return this.groups.length == 0;
  };
  this.print = function() {
    console.log("= = BEGIN PRINT = =");
    for(var i = 0, len = this.groups.length; i < len; ++i)
    {
      console.log(" - G" + i);
      var g = this.getGroup(i);
      for(var j = 0, len2 = g.length; j < len2; ++j)
      {
        console.log(g[j]);
      }
    }
    console.log("= = END PRINT = =");
  };
};
var BitTerm = function(bits)
{
  this.bits = bits;
  this.terms = [];
  this.dirty = false;

  this.getBits = function() {
    return this.bits;
  };
  this.addTerms = function(t) {
    if (t instanceof BitTerm)
    {
      this.terms.push(t);
    }
    else
    {
      this.terms = this.terms.concat(t);
    }
  };
  this.getTerms = function() {
    return this.terms.length == 0 ? this : this.terms;
  };
  this.hasTerms = function(t) {
    if (t instanceof BitTerm)
    {
      if (this.terms.length == 0)
      {
        return t.getBits() == this.getBits();
      }
      else
      {
        return containsBitTerm(this.terms, t);
      }
    }
    else
    {
      if (this.terms.length == 0)
      {
        for(var i = 0; i < t.length; ++i)
        {
          if (t.getBits() == this.getBits())
          {
            return true;
          }
        }
        return false;
      }
      else
      {
        for(var i = 0; i < t.length; ++i)
        {
          if (containsBitTerm(this.terms, t[i]) == true)
          {
            return true;
          }
        }
        return false;
      }
    }
  };
  this.removeTerms = function(t) {
    if (t instanceof BitTerm)
    {
      var i = this.terms.indexOf(t);
      if (i != -1)
      {
        this.terms.splice(i, 1);
      }
    }
    else
    {
      for(var i = 0; i < this.terms.length; ++i)
      {
        for(var j = 0; j < t.length; ++j)
        {
          if (this.terms[i] == t[j])
          {
            this.terms.splice(i, 1);
            --i;
          }
        }
      }
    }
  };
  this.isEmpty = function() {
    return this.terms.length == 0;
  };
  this.isDirty = function() {
    return this.dirty;
  };
  this.markDirty = function() {
    this.dirty = true;
    for(var i = 0; i < this.terms.length; ++i)
    {
      this.terms[i].markDirty();
    }
  };
  this.toCanonicalString = function(dashes) {
    var res = "";
    for(var i = 0, len = this.bits.length; i < len; ++i)
    {
      if (this.bits[i] == '-')
      {
        if (dashes)
        {
          res += "- ";
        }
        continue;
      }

      var s = String.fromCharCode('A'.charCodeAt(0) + i);
      if (this.bits[i] == '0')
      {
        res += s + "'";
      }
      else if (this.bits[i] == '1')
      {
        res += s + " ";
      }
      else
      {
        res += "??";
      }
    }
    return res;
  };
  this.toTermString = function(ctx) {
    if (this.terms.length > 0)
    {
      var s = "";
      for(var i = 0, len = this.terms.length; i < len; ++i)
      {
        if (i != 0) s += "-";
        s += this.terms[i].toTermString(ctx);
      }
      return s;
    }
    else
    {
      return (ctx ? (ctx.mterms.indexOf(this) == -1 ? "d" : "m") : "") + parseInt(this.bits, 2);
    }
  };
  this.toString = function() {
    return this.bits;
  };
  this.isEqual = function(term) {
    if (!term) return false;
    for(var i = 0, len = this.bits.length; i < len; ++i)
    {
      var b = this.bits[i];
      var b2 = term.bits[i];
      if (b == '-') continue;
      if (b2 == '-') continue;
      if (b != b2) return false;
    }
    return true;
  };
};

function formatBitTerm(ctx, term)
{
  var str = term.toString(2);
  while(str.length < ctx.bits)
  {
    str = '0' + str;
  }
  return str;
}

function containsBitTerm(arr, bitterm)
{
  for(var i = 0; i < arr.length; ++i)
  {
    if (arr[i].getBits() === bitterm.getBits())
    {
      return true;
    }
  }

  return false;
}

function containsFuzzyBitTerm(arr, bitterm)
{
  for(var i = 0; i < arr.length; ++i)
  {
    if (bitterm.isEqual(arr[i]))
    {
      return true;
    }
  }

  return false;
}

function indexOfFuzzyBitTerm(arr, bitterm)
{
  for(var i = 0; i < arr.length; ++i)
  {
    if (bitterm.isEqual(arr[i]))
    {
      return i;
    }
  }

  return -1;
}

function diffBitTerms(ctx, a, b)
{
  var diffs = numOfDiffs(ctx.bits, a, b);
  if (diffs == 1)
  {
    var d = 0;
    for(var i = 0, len = ctx.bits; i < len; ++i)
    {
      if (a[i] === b[i])
      {
        continue;
      }
      else
      {
        //The One Diff is Found
        return a.substr(0, i) + '-' + a.substr(i + 1);
      }
    }
  }
  else
  {
    return;
  }
}

function numOfDiffs(len, a, b)
{
  var d = 0;
  for(var i = 0; i < len; ++i)
  {
    if (a[i] === b[i])
    {
      continue;
    }
    else
    {
      d++;
    }
  }
  return d;
}

function onesOfBitTerm(bitTerm)
{
  var ones = 0;
  var i = bitTerm.length;
  while(i--)
  {
    if (bitTerm[i] == '1')
    {
      ones++;
    }
  }
  return ones;
}

function calcMostSigBitsOfTerms(terms)
{
  var res = 0;
  for(var i = 0; i < terms.length; ++i)
  {
    var j = mostSigBits(terms[i]);
    if (j > res || res == 0)
    {
      res = j;
    }
  }
  return res;
}

function mostSigBits(num)
{
  var sigbits = 0;
  while(num != 0)
  {
    sigbits++;
    num = num >> 1;
  }
  return sigbits;
}

function sortAndUnique(array)
{
  if (array.length == 0) return array;
  array = array.sort(function(a, b) {return a * 1 - b * 1;});
  var res = [array[0]];
  for(var i = 1; i < array.length; ++i)
  {
    if (array[i-1] !== array[i])
    {
      res.push(array[i]);
    }
  }
  return res;
}


function SOPToString(sop)
{
  var s = "";
  for(var i = 0; i < sop.length; ++i)
  {
    if (i != 0)
    {
      s += " + ";
    }

    s += "(";
    prod = sop[i];
    for(var j = 0; j < prod.length; ++j)
    {
      var term = prod[j];
      if (j != 0)
      {
        s += "*";
      }
      s += "" + term.toCanonicalString();
    }
    s += ")";
  }
  return s;
}

function POSToString(pos)
{
  var s = "";
  for(var i = 0; i < pos.length; ++i)
  {
    s += "(";
    sum = pos[i];
    for(var j = 0; j < sum.length; ++j)
    {
      var term = sum[j];
      if (j != 0)
      {
        s += " + ";
      }
      s += "" + term.toCanonicalString();
    }
    s += ")";
  }
  return s;
}

function POS2SOP(pos)
{
  console.log("Converting POS to SOP . . .");
  console.log(POSToString(pos));

  var sop = [];
  var sum = pos.splice(0, 1)[0];
  for(var i = 0; i < sum.length; ++i)
  {
    var prod = [];
    prod.push(sum[i]);
    sop.push(prod);
  }
  return _POS2SOP(sop, pos);
}

function _POS2SOP(sop, pos)
{
  if (pos.length == 0)
  {
    return sop;
  }
  else
  {
    console.log("SOP Solved: " + SOPToString(sop));
    console.log("POS Remaining: " + POSToString(pos));
    console.log("Multiplying . . .");
    var sum = pos.splice(0, 1)[0];
    return _POS2SOP(distribute(sop, sum), pos);
  }
}

function distribute(sop, sum)
{
  var result = [];
  for(var i = 0; i < sop.length; ++i)
  {
    for(var j = 0; j < sum.length; ++j)
    {
      var prod = sop[i].slice();
      var term = sum[j];
      if (prod.indexOf(term) == -1)
      {
        prod.push(term);
      }
      result.push(prod);
    }
  }
  return result;
}

function simplify(sop)
{
  console.log("UNSIMPLIFIED: " + SOPToString(sop));

  //X+X=X
  for(var i = 0; i < sop.length; ++i)
  {
    var prod = sop[i];
    for(var ii = 0; ii < sop.length; ++ii)
    {
      if (ii == i) continue;

      var other = sop[ii];
      var flag = true;
      for(var j = 0; j < prod.length; ++j)
      {
        var term = prod[j];
        if (other.indexOf(term) == -1)
        {
          flag = false;
          break;
        }
      }

      if (flag == true)
      {
        sop.splice(ii, 1);
        if (ii < i)
        {
          --i;
        }
        --ii;
      }
    }
  }
  console.log("SIMPLIFIED BY: X+X=X AND X+XY=X");
  console.log("FOUND: " + SOPToString(sop));
}

function parse(src)
{
  var res = [];
  var terms = src.split(",");
  var term = "";

  for(var i = 0; i < terms.length; ++i)
  {
    term = terms[i].replace(/\s+/g, "");
    if (term.length == 0) continue;

    term = parseInt(term);
    if (isNaN(term))
    {
      return false;
    }
    else
    {
      res.push(term);
    }
  }

  return res;
}

function createContext(mterms, dterms)
{
  var umt = sortAndUnique(mterms);
  var udt = sortAndUnique(dterms);
  var t = umt.concat(udt);
  t = sortAndUnique(t);

  var ctx = {
    terms: [],
    mterms: [],
    dterms: [],
    bits: calcMostSigBitsOfTerms(t),
    solution: []
  };

  for(var i = 0, len = t.length; i < len; ++i)
  {
    var term = t[i];
    var bitterm = new BitTerm(formatBitTerm(ctx, term));
    if (umt.indexOf(term) != -1)
    {
      ctx.mterms.push(bitterm);
    }
    else
    {
      ctx.dterms.push(bitterm);
    }
    ctx.terms.push(bitterm);
  }

  return ctx;
}

function generateGrayCode(bits)
{
  if (bits <= 0) return [];

  var result = [];

  result.push("0");
  result.push("1");

  var i = 0, j = 0;
  for (i = 2; i < (1 << bits); i = i << 1)
  {
    for (j = i - 1 ; j >= 0; --j)
    {
      result.push(result[j]);
    }

    for(j = 0; j < i; ++j)
    {
      result[j] = "0" + result[j];
    }

    for(j = i; j < 2 * i; ++j)
    {
      result[j] = "1" + result[j];
    }
  }

  return result;
}

function generatePastelColor()
{
    var r = (Math.round(Math.random()* 127) + 127).toString(16);
    var g = (Math.round(Math.random()* 127) + 127).toString(16);
    var b = (Math.round(Math.random()* 127) + 127).toString(16);
    return '#' + r + g + b;
}
