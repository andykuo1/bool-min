/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "dist/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./test/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/qm/QMMethod.js":
/*!****************************!*\
  !*** ./src/qm/QMMethod.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return solve; });\nfunction solve(mTerms, dTerms)\n{\n  console.log(\"=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-\");\n  console.log(\"Solving by Quine-McCluskey method...\");\n  console.log(\"=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-\");\n\n  //Assumes mTerms and dTerms are disjoint sets\n  const ctx = {\n    terms: mTerms.concat(dTerms).sort(numComparator),\n    mterms: mTerms.sort(numComparator),\n    dterms: dTerms.sort(numComparator),\n    bitCount: 0\n  };\n\n  let i, j;\n\n  //Count maximum bits for terms\n  j = 0;\n  for(let term of ctx.terms)\n  {\n    i = bitCount32(term);\n    if (!j || i > j) j = i;\n  }\n  ctx.bitCount = j;\n\n  console.log(\"...for terms:\", ctx.terms);\n  console.log(\"...for mTerms:\", ctx.mterms);\n  console.log(\"...for dTerms:\", ctx.dterms);\n  console.log(\"...found terms to be using\", ctx.bitCount, \"bits.\");\n  console.log();\n\n  console.log(\"Sorting terms into one-groups...\");\n\n  //Sort all terms by the count of 1's in bits\n  const size1OneGroups = new Array(ctx.bitCount);\n  for(let term of ctx.terms)\n  {\n    i = countSetBits(term) - 1;\n    //console.log(\"...counted bits:\", term, \"has\", i + 1, \"bit(s)...\");\n    let group = size1OneGroups[i];\n    if (!group) group = size1OneGroups[i] = [];\n    group.push(createSingleImplicant(ctx, term));\n  }\n  console.log(\"Created size-1 one-groups:\", size1OneGroups.map(e=>e.map(e=>parseImplicantToBitString(ctx, e))));\n  console.log();\n\n  console.log(\"Starting to find all implicants...\");\n  console.log();\n\n  //Find implicants by evaluating terms that vary only by a single digit\n  //Each 1-count group terms should be compared to the next 1-count group\n  //to find singly-varied pairs.\n\n  /*\n  ImplicantGroups[termSize]\n    > OneGroup[setBitCount]\n      > Implicant(terms, mask, dirty)\n  */\n\n  //Setup size 1 implicant groups\n  const implicantGroups = [];\n  implicantGroups.push(size1OneGroups);\n\n  //Find k size implicant groups...\n  for(let termSizeMinusOne = 0; termSizeMinusOne < implicantGroups.length; ++termSizeMinusOne)\n  {\n    //Starting with the previous implicant group (by term size)\n    console.log(\"Creating implicant group size-\" + (termSizeMinusOne + 2), \"...\");\n    const prevOneGroups = implicantGroups[termSizeMinusOne];\n\n    //Create the next implicant group (by term size)\n    const result = new Array(ctx.bitCount);\n    //If no further implicants found for new group, finish the computation\n    let flag = false;\n\n    for(let setBitCountMinusOne = 0, length = prevOneGroups.length - 1; setBitCountMinusOne < length; ++setBitCountMinusOne)\n    {\n      //For the previous implicant group, compare each one-group to other one-groups\n      console.log(\"...searching\", setBitCountMinusOne + 1, \"set bit(s) one-group...\");\n      const oneGroup = prevOneGroups[setBitCountMinusOne];\n      //Group was not found earlier\n      if (!oneGroup) break;\n\n      //To store newly found implicants\n      const newImplicants = [];\n\n      //If any pairs are found to match, add the pair to the next implicant group's respective one-group\n      for(let term of oneGroup)\n      {\n        const nextOneGroup = prevOneGroups[setBitCountMinusOne + 1];\n\n        //Group was not found earlier\n        if (!nextOneGroup) break;\n\n        for(let other of nextOneGroup)\n        {\n          if (isValidImplicantPair(term, other))\n          {\n            const implicant = createJointImplicant(ctx, term, other);\n            console.log(\"...\", implicant.terms, \" => \", parseImplicantToBitString(ctx, implicant), \"...\");\n\n            newImplicants.push(implicant);\n          }\n          else\n          {\n            //console.log(\"...skipping\", term.terms.concat(other.terms), \"...\");\n          }\n        }\n      }\n\n      //If found valid implicants...\n      if (newImplicants.length > 0)\n      {\n        result[setBitCountMinusOne] = newImplicants;\n        flag = true;\n\n        console.log(\"... > Found new implicants:\", newImplicants.map(e => parseImplicantToBitString(ctx, e)));\n      }\n      else\n      {\n        console.log(\"... > None found.\");\n      }\n    }\n\n    //If found valid next implicant group...\n    if (flag)\n    {\n      console.log(\"Created size-\" + (termSizeMinusOne + 1), \"one-groups:\", result.map(e=>e.map(e=>parseImplicantToBitString(ctx, e))));\n      implicantGroups.push(result);\n    }\n    else\n    {\n      console.log(\"Skipped size-\" + (termSizeMinusOne + 1), \"one-groups.\");\n    }\n\n    console.log();\n  }\n\n  //Identify prime implicants\n  console.log(\"Identifying prime implicants...\");\n  const primeImplicants = [];\n  const usedTerms = new Map();\n  for(let implicantGroup of implicantGroups)\n  {\n    if (!implicantGroup) continue;\n    for(let oneGroup of implicantGroup)\n    {\n      if (!oneGroup) continue;\n      for(let implicant of oneGroup)\n      {\n        //Found a prime implicant...\n        if (!implicant.dirty)\n        {\n          //Make sure each implicant is unique...\n          let isUnique = true;\n          for(let primeImplicant of primeImplicants)\n          {\n            if (primeImplicant.terms.length == implicant.terms.length)\n            {\n              let isDupe = true;\n              for(let term of implicant.terms)\n              {\n                if (!primeImplicant.terms.includes(term))\n                {\n                  isDupe = false;\n                  break;\n                }\n              }\n\n              //It is a duplicate implicant\n              if (isDupe)\n              {\n                isUnique = false;\n                break;\n              }\n            }\n          }\n\n          //Only add the implicant if it is unique\n          if (isUnique)\n          {\n            //Store into used terms\n            for(let term of implicant.terms)\n            {\n              //Must be a mterm\n              if (!ctx.mterms.includes(term)) continue;\n\n              if (usedTerms.has(term))\n              {\n                usedTerms.get(term).push(implicant);\n              }\n              else\n              {\n                usedTerms.set(term, [implicant]);\n              }\n            }\n\n            //Add to prime implicants\n            primeImplicants.push(implicant);\n          }\n        }\n      }\n    }\n  }\n  console.log(\"Prime implicants:\", primeImplicants.map(e=>parseImplicantToBitString(ctx, e)));\n  console.log();\n\n  //Finding essential prime implicants\n  console.log(\"Identifying essential prime implicants...\");\n  const essentialPrimeImplicants = [];\n  for(let term of usedTerms.keys())\n  {\n    const candidates = usedTerms.get(term);\n    if (candidates)\n    {\n      if (candidates.length == 1)\n      {\n        const candidate = candidates[0];\n        console.log(\"Found essential for term\", term, \"as\", parseImplicantToBitString(ctx, candidate));\n        essentialPrimeImplicants.push(candidate);\n        for(let markedTerm of candidate.terms)\n        {\n          usedTerms.set(markedTerm, null);\n        }\n      }\n    }\n  }\n  console.log(\"Essential Prime Implicants:\", essentialPrimeImplicants.map(e=>parseImplicantToBitString(ctx, e)));\n  console.log();\n\n  console.log(\"Finding remaining essential prime implicants...\");\n  const result = [];\n  //Make sure found essential prime implicants are in result...\n  for(let implicant of essentialPrimeImplicants)\n  {\n    result.push(parseImplicantToLiteralString(ctx, implicant));\n  }\n  //For every used terms, look for other implicants to cover remaining terms...\n  console.log(\"Remaining:\", usedTerms);\n  for(let term of usedTerms.keys())\n  {\n    const candidates = usedTerms.get(term);\n    if (candidates)\n    {\n      const candidate = candidates[0];\n      result.push(parseImplicantToLiteralString(ctx, candidate));\n      for(let markedTerm of candidate.terms)\n      {\n        usedTerms.set(markedTerm, null);\n      }\n    }\n  }\n  console.log(\"Solution:\", result);\n\n  //For k-maps, circle all essential prime implicants, and then circle the remaining chosen implicants...\n  return result;\n};\n\nfunction createSingleImplicant(ctx, term)\n{\n  return {\n    terms: [term],\n    value: term,\n    mask: 0,\n    dirty: false\n  };\n}\n\nfunction createJointImplicant(ctx, a, b)\n{\n  a.dirty = true;\n  b.dirty = true;\n\n  const valueBits = a.value ^ b.value;\n  return {\n    terms: a.terms.concat(b.terms),\n    value: a.value | b.value,\n    mask: a.mask | b.mask | valueBits,\n    dirty: false\n  };\n}\n\nfunction parseImplicantToBitString(ctx, implicant)\n{\n  let result = implicant.value.toString(2).padStart(ctx.bitCount,'0');\n  for(let i = 0, l = result.length; i < l; ++i)\n  {\n    if ((implicant.mask >> i) & 1 == 1)\n    {\n      result = result.substring(0, l - (i + 1)) + '-' + result.substring(l - i);\n    }\n  }\n  return result;\n}\n\nfunction parseImplicantToLiteralString(ctx, implicant)\n{\n  let result = \"\";\n  const variableOffset = \"A\".charCodeAt(0) + ctx.bitCount - 1;\n  const value = implicant.value;\n  const mask = implicant.mask;\n  for(let i = 0; i < ctx.bitCount; ++i)\n  {\n    if ((mask >> i) & 1 == 1) continue;\n    if ((value >> i) & 1 == 1)\n    {\n      result = String.fromCharCode(variableOffset - i) + result;\n    }\n    else\n    {\n      result = String.fromCharCode(variableOffset - i) + \"\\'\" + result;\n    }\n  }\n  return result;\n}\n\nfunction isValidImplicantPair(a, b)\n{\n  const valueBits = a.value ^ b.value;\n  const maskBits = a.mask ^ b.mask;\n  return isPowerOfTwo(maskBits) && a.value == b.value ||\n    isPowerOfTwo(valueBits) && a.mask == b.mask;\n}\n\n//Assumes value is under 32 bits\nfunction bitCount32(value)\n{\n  value = value - ((value >> 1) & 0x55555555);\n  value = (value & 0x33333333) + ((value >> 2) & 0x33333333);\n  return ((value + (value >> 4) & 0xF0F0F0F) * 0x1010101) >> 24;\n}\n\nfunction countSetBits(value)\n{\n  let c;\n  for(c = 0; value > 0; ++c)\n  {\n    value &= (value - 1);\n  }\n  return c;\n}\n\nfunction isPowerOfTwo(value)\n{\n  return value && (!(value & (value - 1)));\n}\n\nfunction numComparator(a, b)\n{\n  return a - b;\n}\n\n\n//# sourceURL=webpack:///./src/qm/QMMethod.js?");

/***/ }),

/***/ "./test/QMMethodTest.js":
/*!******************************!*\
  !*** ./test/QMMethodTest.js ***!
  \******************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var qm_QMMethod_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! qm/QMMethod.js */ \"./src/qm/QMMethod.js\");\n\n\nObject(qm_QMMethod_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])([4, 8, 10, 11, 12, 15], [9, 14]);\n//Should be: bc'd' + ac + ab'\n\nObject(qm_QMMethod_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])([3,7,11,12,13,14,15], []);\n//Should be: ab + cd(a' + b')\n\n\nObject(qm_QMMethod_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])([2, 6, 7], []);\n//Should be: ab + bc'\n\n\n//# sourceURL=webpack:///./test/QMMethodTest.js?");

/***/ }),

/***/ "./test/index.js":
/*!***********************!*\
  !*** ./test/index.js ***!
  \***********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _QMMethodTest_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./QMMethodTest.js */ \"./test/QMMethodTest.js\");\n\n\n\n//# sourceURL=webpack:///./test/index.js?");

/***/ })

/******/ });