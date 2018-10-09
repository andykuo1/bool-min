export default function solve(mTerms, dTerms)
{
  console.log("=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-");
  console.log("Solving by Quine-McCluskey method...");
  console.log("=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-");

  //Assumes mTerms and dTerms are disjoint sets
  const ctx = {
    terms: mTerms.concat(dTerms).sort(numComparator),
    mterms: mTerms.sort(numComparator),
    dterms: dTerms.sort(numComparator),
    bitCount: 0
  };

  let i, j;

  //Count maximum bits for terms
  j = 0;
  for(let term of ctx.terms)
  {
    i = bitCount32(term);
    if (!j || i > j) j = i;
  }
  ctx.bitCount = j;

  console.log("...for terms:", ctx.terms);
  console.log("...for mTerms:", ctx.mterms);
  console.log("...for dTerms:", ctx.dterms);
  console.log("...found terms to be using", ctx.bitCount, "bits.");
  console.log();

  console.log("Sorting terms into one-groups...");

  //Sort all terms by the count of 1's in bits
  const size1OneGroups = new Array(ctx.bitCount);
  for(let term of ctx.terms)
  {
    i = countSetBits(term) - 1;
    //console.log("...counted bits:", term, "has", i + 1, "bit(s)...");
    let group = size1OneGroups[i];
    if (!group) group = size1OneGroups[i] = [];
    group.push(createSingleImplicant(term));
  }
  console.log("Created size-1 one-groups:", size1OneGroups.map(e=>e.map(e=>e.terms)));
  console.log();

  console.log("Starting to find all implicants...");
  console.log();

  //Find implicants by evaluating terms that vary only by a single digit
  //Each 1-count group terms should be compared to the next 1-count group
  //to find singly-varied pairs.

  /*
  ImplicantGroups[termSize]
    > OneGroup[setBitCount]
      > Implicant(terms, mask, dirty)
  */

  //Setup size 1 implicant groups
  const implicantGroups = [];
  implicantGroups.push(size1OneGroups);

  //Find k size implicant groups...
  for(let termSizeMinusOne = 0; termSizeMinusOne < implicantGroups.length; ++termSizeMinusOne)
  {
    //Starting with the previous implicant group (by term size)
    console.log("Creating implicant group size-" + (termSizeMinusOne + 2), "...");
    const prevOneGroups = implicantGroups[termSizeMinusOne];

    //Create the next implicant group (by term size)
    const result = new Array(ctx.bitCount);
    //If no further implicants found for new group, finish the computation
    let flag = false;

    for(let setBitCountMinusOne = 0, length = prevOneGroups.length - 1; setBitCountMinusOne < length; ++setBitCountMinusOne)
    {
      //For the previous implicant group, compare each one-group to other one-groups
      console.log("...searching", setBitCountMinusOne + 1, "set bit(s) one-group...");
      const oneGroup = prevOneGroups[setBitCountMinusOne];
      //Group was not found earlier
      if (!oneGroup) break;

      //To store newly found implicants
      const newImplicants = [];

      //If any pairs are found to match, add the pair to the next implicant group's respective one-group
      for(let term of oneGroup)
      {
        const nextOneGroup = prevOneGroups[setBitCountMinusOne + 1];

        //Group was not found earlier
        if (!nextOneGroup) break;

        for(let other of nextOneGroup)
        {
          if (isValidImplicantPair(term, other))
          {
            const implicant = createJointImplicant(term, other);
            console.log("...", implicant.terms, "...");

            newImplicants.push(implicant);
          }
          else
          {
            //console.log("...skipping", term.terms.concat(other.terms), "...");
          }
        }
      }

      //If found valid implicants...
      if (newImplicants.length > 0)
      {
        result[setBitCountMinusOne] = newImplicants;
        flag = true;

        console.log("... > Found new implicants:", newImplicants);
      }
      else
      {
        console.log("... > None found.");
      }
    }

    //If found valid next implicant group...
    if (flag)
    {
      console.log("Created size-" + (termSizeMinusOne + 1), "one-groups:", result.map(e=>e.map(e=>e.terms)));
      implicantGroups.push(result);
    }
    else
    {
      console.log("Skipped size-" + (termSizeMinusOne + 1), "one-groups.");
    }

    console.log();
  }

  //Identify prime implicants
  console.log("Identifying prime implicants...");
  const primeImplicants = [];
  const usedTerms = new Map();
  for(let implicantGroup of implicantGroups)
  {
    if (!implicantGroup) continue;
    for(let oneGroup of implicantGroup)
    {
      if (!oneGroup) continue;
      for(let implicant of oneGroup)
      {
        //Found a prime implicant...
        if (!implicant.dirty)
        {
          //Make sure each implicant is unique...
          let isUnique = true;
          for(let primeImplicant of primeImplicants)
          {
            if (primeImplicant.terms.length == implicant.terms.length)
            {
              let isDupe = true;
              for(let term of implicant.terms)
              {
                if (!primeImplicant.terms.includes(term))
                {
                  isDupe = false;
                  break;
                }
              }

              //It is a duplicate implicant
              if (isDupe)
              {
                isUnique = false;
                break;
              }
            }
          }

          //Only add the implicant if it is unique
          if (isUnique)
          {
            //Store into used terms
            for(let term of implicant.terms)
            {
              //Must be a mterm
              if (!ctx.mterms.includes(term)) continue;

              if (usedTerms.has(term))
              {
                usedTerms.get(term).push(implicant);
              }
              else
              {
                usedTerms.set(term, [implicant]);
              }
            }

            //Add to prime implicants
            primeImplicants.push(implicant);
          }
        }
      }
    }
  }
  console.log("Prime implicants:", primeImplicants);
  console.log();

  //Finding essential prime implicants
  console.log("Identifying essential prime implicants...");
  const essentialPrimeImplicants = [];
  for(let term of usedTerms.keys())
  {
    const candidates = usedTerms.get(term);
    if (candidates)
    {
      if (candidates.length == 1)
      {
        const candidate = candidates[0];
        console.log("Found essential for term", term, "as", candidate);
        essentialPrimeImplicants.push(candidate);
        for(let markedTerm of candidate.terms)
        {
          usedTerms.set(markedTerm, null);
        }
      }
    }
  }
  console.log("Essential Prime Implicants:", essentialPrimeImplicants);
  console.log();

  console.log("Finding remaining essential prime implicants...");
  const result = [];
  //Make sure found essential prime implicants are in result...
  for(let implicant of essentialPrimeImplicants)
  {
    result.push(parseImplicantToString(ctx, implicant));
  }
  //For every used terms, look for other implicants to cover remaining inputs...
  for(let term of usedTerms.keys())
  {
    const candidates = usedTerms.get(term);
    if (candidates)
    {
      const candidate = candidates[0];
      result.push(parseImplicantToString(ctx, candidate));
      for(let markedTerm of candidate.terms)
      {
        usedTerms.set(markedTerm, null);
      }
    }
  }
  console.log("Solution:", result);

  //For k-maps, circle all essential prime implicants, and then circle the remaining chosen implicants...
  return result;
};

function createSingleImplicant(term)
{
  return {
    terms: [term],
    value: term,
    mask: 0,
    dirty: false
  };
}

function createJointImplicant(a, b)
{
  a.dirty = true;
  b.dirty = true;

  const valueBits = a.value ^ b.value;
  return {
    terms: a.terms.concat(b.terms),
    value: a.value | b.value,
    mask: a.mask | b.mask | valueBits,
    dirty: false
  };
}

function parseImplicantToString(ctx, implicant)
{
  let result = "";
  const variableOffset = "A".charCodeAt(0) + ctx.bitCount - 1;
  const value = implicant.value;
  const mask = implicant.mask;
  for(let i = 0; i < ctx.bitCount; ++i)
  {
    if ((mask >> i) & 1 == 1) continue;
    if ((value >> i) & 1 == 1)
    {
      result = String.fromCharCode(variableOffset - i) + result;
    }
    else
    {
      result = String.fromCharCode(variableOffset - i) + "\'" + result;
    }
  }
  return result;
}

function isValidImplicantPair(a, b)
{
  const valueBits = a.value ^ b.value;
  const maskBits = a.mask ^ b.mask;
  return isPowerOfTwo(maskBits) && a.value == b.value ||
    isPowerOfTwo(valueBits) && a.mask == b.mask;
}

//Assumes value is under 32 bits
function bitCount32(value)
{
  value = value - ((value >> 1) & 0x55555555);
  value = (value & 0x33333333) + ((value >> 2) & 0x33333333);
  return ((value + (value >> 4) & 0xF0F0F0F) * 0x1010101) >> 24;
}

function countSetBits(value)
{
  let c;
  for(c = 0; value > 0; ++c)
  {
    value &= (value - 1);
  }
  return c;
}

function isPowerOfTwo(value)
{
  return value && (!(value & (value - 1)));
}

function numComparator(a, b)
{
  return a - b;
}
