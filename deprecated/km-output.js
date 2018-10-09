function outputKMap(ctx)
{
  var ybits = Math.floor(ctx.bits / 2);
  var xbits = ctx.bits - ybits;

  var result = "";
  var title = "";
  var header = "";
  var body = "";
  var row = "";
  var cell = "";

  var colors = [];
  for(var i = 0, len = ctx.solution.length; i < len; ++i)
  {
    colors[i] = generatePastelColor();
  }

  for(var i = 0, len = ybits; i < len; ++i)
  {
    title += (String.fromCharCode('A'.charCodeAt(0) + i));
  }
  title += " X ";
  for(var i = ybits, len = ctx.bits; i < len; ++i)
  {
    title += (String.fromCharCode('A'.charCodeAt(0) + i));
  }

  result = "<h3>" + title + "</h3>";
  result += "<table>";
  header = "<th></th>";

  var xgraycode = generateGrayCode(xbits);
  for(var i = 0, len = xgraycode.length; i < len; ++i)
  {
    header += "<th>";
    header += xgraycode[i];
    header += "</th>";
  }
  result += "<thead><tr>" + header + "</tr></thead>";

  var ygraycode = generateGrayCode(ybits);
  for(var i = 0, len = ygraycode.length; i < len; ++i)
  {
    row = "<th>";
    row += ygraycode[i];
    row += "</th>";
    for(var j = 0, len2 = xgraycode.length; j < len2; ++j)
    {
      var bt = new BitTerm(ygraycode[i] + xgraycode[j]);
      if (containsFuzzyBitTerm(ctx.mterms, bt) == true)
      {
        cell = "1";
      }
      else if (containsFuzzyBitTerm(ctx.dterms, bt) == true)
      {
        cell = "X";
      }
      else
      {
        cell = "0";
      }

      var k = indexOfFuzzyBitTerm(ctx.solution, bt);
      if (k == -1)
      {
        row += "<td>" + cell + "</td>";
      }
      else
      {
        row += "<td bgcolor=" + colors[k] + ">" + cell + "</td>";
      }
    }
    result += "<tr>" + row + "</tr>";
  }

  result += "</table>";
  $('.output-km #kmap').html(result);
}

function outputSolutionKM(ctx, solution)
{
  $('.output-km #solution').text("Solution: " + solution);
}
