function processKM(ctx)
{
  outputKMap(ctx);

  var output = "";
  for(var i = 0; i < ctx.solution.length; ++i)
  {
    if (i > 0)
    {
      output += " + ";
    }

    output += "" + ctx.solution[i].toCanonicalString();
  }
  outputSolutionKM(ctx, output);

  return ctx;
}
