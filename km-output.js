function outputKMap(ctx)
{
  var ybits = ctx.bits / 2;
  var xbits = ctx.bits - ybits;

  var result = "";
  var title = "";
  var header = "";
  var body = "";
  var row = "";

  for(var i = 0, len = ybits; i < len; ++i)
  {
    title += (String.fromCharCode('A'.charCodeAt(0) + i));
  }
  title += " X ";
  for(var i = ybits, len = ybits + xbits; i < len; ++i)
  {
    title += (String.fromCharCode('A'.charCodeAt(0) + i));
  }

  result = "<h3>" + title + "</h3>";
  result += "<table>";
  header = "<th></th>";
  for(var i = 0, len = Math.pow(2, xbits); i < len; ++i)
  {
    var b = "";
    for(var j = 0, len2 = xbits; j < len2; ++j)
    {
      b += "0";
    }
  }
  for(var i = 0, len = ctx.bits; i < len; ++i)
  {
    header += "<th>" + (String.fromCharCode('A'.charCodeAt(0) + i)) + "</th>";
  }
  header += "<th></th>"
  header += "<th>F</th>";
  result += "<tr>" + header + "</tr>";

  for(var j = 0, len = Math.pow(2, ctx.bits); j < len; ++j)
  {
    row = "<tr>";
    row += "<td>" + j + "</td>";
    for(var i = ctx.bits - 1; i >= 0; --i)
    {
      row += "<td>" + ((j >> i) % 2) + "</td>";
    }

    var flag = false;
    if (containsBitTerm(ctx.mterms, new BitTerm(formatBitTerm(ctx, j))))
    {
      row += "<td></td><td>" + "1" + "</td>";
    }
    else if (containsBitTerm(ctx.dterms, new BitTerm(formatBitTerm(ctx, j))))
    {
      row += "<td></td><td>" + "X" + "</td>";
    }
    else
    {
      row += "<td></td><td>" + "0" + "</td>";
    }
    row += "</tr>";
    body += row;
  }
  result += body;

  result += "</table>";
  $('.output-km #kmap').html(result);
}

function outputSolutionKM(ctx, solution)
{
  $('.output-km #solution').text("Solution: " + solution);
}
