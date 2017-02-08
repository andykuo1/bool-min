function outputOneGroups(ctx, onegroups, title)
{
  var result = "";
  var header = "";
  var row = "";

  //Output header
  result = "<div style=\"display: inline-block; padding: 0px 10px;\">"
  result += "<h2>" + title + "</h2>";
  result += "<table>";
  header = "<th>Group</th><th>Terms</th>";
  result += "<tr>" + header + "</tr>";

  //Output group terms
  for(var i = 0, len = onegroups.size(); i < len; ++i)
  {
    var g = onegroups.getGroup(i);
    if (g.length == 0) continue;

    row += "<tr>";
    row += "<td>" + g.name + "</td>";
    for(var j = 0, len2 = g.length; j < len2; ++j)
    {
      if (j != 0) row += "<td></td>";
      var term = g[j];
      if (term.isDirty())
      {
        row += "<td bgcolor=\"" + "#D49090" +"\">"
      }
      else
      {
        row += "<td bgcolor=\"" + "#A1D490" +"\">"
      }
      row += term.toTermString(ctx) + "(" + g[j].toCanonicalString(true) + ")" + "</td></tr><tr>";
    }
  }
  result += row;

  result += "</table>";
  result += "</div>";

  $('.output-qm #grouptables').append(result);
}

function outputOneGroupses(ctx, onegroupses)
{
  $('.output-qm #grouptables').empty();
  for(var i = 0, len = onegroupses.length; i < len; ++i)
  {
    var g = onegroupses[i];
    outputOneGroups(ctx, g, "Step " + (i + 1));
  }
}

function outputEssentials(ctx, essentials)
{
  var result = "";
  var header = "";
  var row = "";

  //Output header
  result = "<table>";
  header = "<th>Terms</th>";
  for(var i = 0, len = ctx.mterms.length; i < len; ++i)
  {
    header += "<th>" + ctx.mterms[i].toTermString() + "</th>";
  }
  result += "<tr>" + header + "</tr>";

  //Output essentials
  for(var i = 0, len = essentials.length; i < len; ++i)
  {
    var ess = essentials[i];
    row = "<tr>";
    row += "<td>" + ess.toTermString(ctx) + "</td>";
    for(var j = 0, len2 =  ctx.mterms.length; j < len2; ++j)
    {
      var mt = ctx.mterms[j];
      if (ess.hasTerms(mt))
      {
        row += "<td>X</td>";
      }
      else
      {
        row += "<td></td>";
      }
    }
    row += "</tr>";
    result += row;
  }
  result += "</table>";

  $('.output-qm #essentialtable').html(result);
}

function outputPrimeImplicantTerms(ctx, primeterms)
{
  var result = "";
  result += "<h3>";
  for(var i = 0; i < primeterms.length; ++i)
  {
    result += "<h3>";
    var term = primeterms[i];
    if (i != 0) result += "";
    result += term.toCanonicalString();
    result += "</h3>";
  }

  $('.output-qm #primeimplicant').html(result);
}

function outputSolutionQM(ctx, solution)
{
  $('.output-qm #solution').text("Solution: " + solution);
}
