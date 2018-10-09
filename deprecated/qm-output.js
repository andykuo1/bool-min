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

function outputImplicantTable(ctx, implicants)
{
  var result = "";
  var header = "";
  var colbody = "";
  var body = "";
  var row = "";
  var cell = "";

  var prime = false;
  var primecolor = "#000000";

  var colcolor = [ctx.mterms.length];

  //Output header
  result = "<table>";
  header = "<th>Terms</th>";
  for(var i = 0, len = ctx.mterms.length; i < len; ++i)
  {
    header += "<th>" + ctx.mterms[i].toTermString() + "</th>";
  }
  result += "<tr>" + header + "</tr>";

  //Output implicants
  for(var i = 0, len = implicants.length; i < len; ++i)
  {
    var ess = implicants[i];
    prime = containsBitTerm(ctx.solution, ess);
    if (prime)
    {
      primecolor = generatePastelColor();
    }

    row = prime ? "<tr style=\"background-color:" + primecolor + "\">" : "<tr>";
    row += "<td>" + ess.toTermString(ctx) + "</td>";
    for(var j = 0, len2 =  ctx.mterms.length; j < len2; ++j)
    {
      var mt = ctx.mterms[j];
      row += "<td>";
      if (ess.hasTerms(mt))
      {
        row += "X";
        if (prime)
        {
          colcolor[j] = primecolor;
        }
      }
      row += "</td>";
    }
    row += "</tr>";
    body += row;
  }

  for(var i = 0, len = colcolor.length; i < len; ++i)
  {
    var c = colcolor[i];
    if (c)
    {
      colbody += "<col style=\"background-color:" + c + "\">"
    }
  }
  result += "<colgroup><col>" + colbody + "</colgroup>";
  result += body;
  result += "</table>";

  $('.output-qm #implicanttable').html(result);
}

function outputPrimeImplicantTerms(ctx, primeterms)
{
  var result = "";
  for(var i = 0; i < primeterms.length; ++i)
  {
    var term = primeterms[i];
    if (i != 0) result += "";
    result += term.toTermString(ctx) + "(";
    result += term.toCanonicalString() + ")";
    result += "<br />";
    result += "<br />";
  }

  $('.output-qm #primeimplicant').html(result);
}

function outputSolutionQM(ctx, solution)
{
  $('.output-qm #solution').text("Solution: " + solution);
}
