
function processQM(mterms, dterms)
{
  var ctx = createContext(mterms, dterms);
  outputInit(ctx);

  var oneGroupses = [];
  console.log("Processing BitTerms to OneGroups . . .");
  var oneGroup = processBitTermsToOneGroups(ctx, ctx.terms);
  oneGroupses.push(oneGroup);

  console.log("Processing OneGroups to Implicants . . .");
  var impGroup = new OneGroups();
  impGroup.addGroup(oneGroup);
  var nextGroup = oneGroup;
  var i = 2;
  while(!nextGroup.isEmpty())
  {
    nextGroup = processBitTermGroups(ctx, nextGroup);
    if (nextGroup.size() > 0)
    {
      impGroup.addGroup(nextGroup);
      oneGroupses.push(nextGroup);
    }
  }
  outputOneGroupses(ctx, oneGroupses);

  console.log("Processing Implicants to Essentials . . .");
  var essterms = processImplicantsToEssentialTerms(ctx, impGroup);
  //outputEssentials(ctx, essterms);

  console.log("Evaluating Essentials to Prime Essentials . . .");
  var simterms = [];
  var unsimterms = [];
  evaluateEssentialsToPrimeEssentials(ctx, essterms, simterms, unsimterms);
  outputPrimeImplicantTerms(ctx, simterms);

  console.log("Evaluating Unsimplified Terms to Simplified . . .");
  evaluateUnsimplifiedTermsToSimplified(ctx, simterms, unsimterms);

  console.log("Solution Found!");
  ctx.solution = simterms.slice();

  //Outputting McCluskey Table . . .
  outputImplicantTable(ctx, essterms);

  var output = "";
  for(var i = 0; i < simterms.length; ++i)
  {
    if (i > 0)
    {
      output += " + ";
    }

    output += "" + simterms[i].toCanonicalString();
  }
  console.log("SOLUTION: " + output);
  outputSolutionQM(ctx, output);

  return ctx;
}

function processBitTermsToOneGroups(ctx, bitterms)
{
  var oneGroup = new OneGroups();
  for(var i = 0, len = bitterms.length; i < len; ++i)
  {
    var bitterm = bitterms[i];
    var j = onesOfBitTerm(bitterm.getBits());
    var g = oneGroup.addToGroup(j, bitterm);
    if (!g.name) g.name = "G" + j;
  }
  return oneGroup;
}

function processBitTermGroups(ctx, btGroup)
{
  console.log("Process bit terms to diff eachother");
  var result = new OneGroups();

  for(var i = 0, len = btGroup.size() - 1; i < len; ++i)
  {
    var g = btGroup.getGroup(i);
    var h = btGroup.getGroup(i + 1);

    console.log("Compare " + g.name + " with " + h.name);
    for(var j = 0, len2 = g.length; j < len2; ++j)
    {
      var gi = g[j];
      for(var k = 0, len3 = h.length; k < len3; ++k)
      {
        var hi = h[k];
        var d = diffBitTerms(ctx, gi.getBits(), hi.getBits());
        if (d)
        {
          var bt = new BitTerm(d);
          bt.addTerms(gi.getTerms());
          bt.addTerms(hi.getTerms());
          gi.markDirty();
          hi.markDirty();

          console.log(" Found diff: " + gi + " and " + hi + " = " + bt);
          var newg = result.addToGroup(i, bt);
          if (!newg.name) newg.name = g.name + "-" + h.name;
        }
      }
    }
  }

  return result;
}

function processImplicantsToEssentialTerms(ctx, impGroup)
{
  var result = [];
  for(var i = 0; i < impGroup.size(); ++i)
  {
    var group = impGroup.getGroup(i);

    for(var j = 0; j < group.length; ++j)
    {
      var bitterm = group[j];
      if (!bitterm.isDirty())
      {
        if (containsBitTerm(result, bitterm) == false)
        {
          result.push(bitterm);
        }
      }
    }
  }
  return result;
}

function evaluateEssentialsToPrimeEssentials(ctx, essterms, simterms, unsimterms)
{
  for(var i = 0; i < ctx.mterms.length; ++i)
  {
    var primeterm = null;
    var isprime = false;
    var ct = ctx.mterms[i];

    for(var j = 0; j < essterms.length; ++j)
    {
      var et = essterms[j];

      if (et.hasTerms(ct) == true)
      {
        console.log(et + " has terms " + ct);
        if (isprime == false)
        {
          console.log("Therefore is a prime term . . .");
          primeterm = et;
          isprime = true;
        }
        else
        {
          console.log("But is NOT since found more!");
          primeterm = null;
          isprime = false;
          break;
        }
      }
      else
      {
        console.log(et + " does not have terms " + ct);
      }
    }

    if (isprime == true)
    {
      console.log("This is it! Found the prime " + primeterm);
      if (simterms.indexOf(primeterm) == -1)
      {
        console.log("ADDING " + primeterm + " AS PRIME TERM . . .");
        simterms.push(primeterm);
        primeterm.prime = true;
      }
      else
      {
        console.log(" . . . however, not adding it since it already is a prime . . .");
      }
    }
  }

  console.log("FOUND: PRIME ESS TERMS! > " + simterms);

  //EVALUATE Unsimplified Terms
  for(var i = 0; i < essterms.length; ++i)
  {
    var essterm = essterms[i];
    var terms = essterm.getTerms();
    if (simterms.indexOf(essterm) == -1)
    {
      //Check if has covered terms . . .
      var covered = false;
      for(var j = 0; j < simterms.length; ++j)
      {
        var st = simterms[j];
        essterm.removeTerms(st.getTerms());
        if (essterm.isEmpty() == true)
        {
          covered = true;
          break;
        }
      }

      if (covered == false)
      {
          unsimterms.push(essterm);
      }
      else
      {
        console.log(essterm + " is completely covered! Skipping unsimplified term . . .");
      }
    }
  }
}

function evaluateUnsimplifiedTermsToSimplified(ctx, simterms, unsimterms)
{
  if (unsimterms.length > 0)
  {
    //Find a product of sums . . .
    var pos = [];
    for(var i = 0; i < ctx.mterms.length; ++i)
    {
      var sum = [];
      var mterm = ctx.mterms[i];
      for(var j = 0; j < unsimterms.length; ++j)
      {
        var term = unsimterms[j];
        if (term.hasTerms(mterm) == true)
        {
          sum.push(term);
        }
      }

      if (sum.length > 0)
      {
        pos.push(sum);
      }
    }

    if (pos.length <= 0)
    {
      return;
    }

    console.log("FOUND: POS TERMS! > " + pos);

    //Distribute to find sum of products . . .
    var sop = POS2SOP(pos);
    console.log("Finished distribution to SOP. . .");
    console.log(SOPToString(sop));

    //SIMPLIFY
    console.log("BEGIN SIMPLIFICATION OF SOP!");
    simplify(sop);

    //GET PRODS WITH LEAST TERMS
    var least = [];
    least.push(sop[0]);
    for(var i = 1; i < sop.length; ++i)
    {
      var prod = sop[i];
      if (prod.length == least[0].length)
      {
        least.push(prod);
      }
      else if (prod.length < least[0].length)
      {
        least.length = 0;
        least.push(prod);
      }
    }
    console.log("Found Products with Least Terms:");
    console.log(least);

    //GET TERMS WITH MOST '-', THEN ADD ONE TO SIMTERMS
    var xprod = null;
    var xbits = 0;
    for(var i = 0; i < least.length; ++i)
    {
      var prod = least[i];
      var bits = 0;
      for(var j = 0; j < prod.length; ++j)
      {
        var term = prod[j];
        bits += (prod[j].getBits().match(/-/g)||[]).length;
      }

      if (xprod == null || bits < xbits)
      {
        xprod = prod;
        xbits = bits;
      }
      else if (bits == xbits)
      {
        console.log("Found other possible simplified term . . . ignoring it . . .");
      }
    }
    console.log("Found essential simplified prod:");
    console.log(xprod);
    console.log("Adding to simplified terms. . .");
    for(var i = 0; i < xprod.length; ++i)
    {
      simterms.push(xprod[i]);
    }
  }
}
