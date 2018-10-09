
export function assertEquals(object, solution=null)
{
  if (Array.isArray(object))
  {
    if (object.length != solution.length) return false;

    let flag = true;
    for(let i = 0, l = object.length; i < l; ++i)
    {
      if (object[i] != solution[i])
      {
        flag = false;
        break;
      }
    }

    //Success!
    if (flag)
    {
      return true;
    }
  }
  else if (!object ? !solution : object == solution)
  {
    //Success!
    return true;
  }

  console.error("Failed.");
  return false;
}
