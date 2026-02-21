/**
 * 🍛 Highway Dhaba Rating System - Higher-Order Functions
 *
 * Highway pe dhabas ki rating system bana raha hai. Higher-order functions
 * (HOF) use karne hain — aise functions jo doosre functions ko parameter
 * mein lete hain YA return karte hain.
 *
 * Functions:
 *
 *   1. createFilter(field, operator, value)
 *      - Returns a FUNCTION that filters objects
 *      - Operators: ">", "<", ">=", "<=", "==="
 *      - e.g., createFilter("rating", ">=", 4) returns a function that
 *        takes an object and returns true if object.rating >= 4
 *      - Unknown operator => return function that always returns false
 *
 *   2. createSorter(field, order = "asc")
 *      - Returns a COMPARATOR function for Array.sort()
 *      - order "asc" => ascending, "desc" => descending
 *      - Works with both numbers and strings
 *
 *   3. createMapper(fields)
 *      - fields: array of field names, e.g., ["name", "rating"]
 *      - Returns a function that takes an object and returns a new object
 *        with ONLY the specified fields
 *      - e.g., createMapper(["name"])({name: "Dhaba", rating: 4}) => {name: "Dhaba"}
 *
 *   4. applyOperations(data, ...operations)
 *      - data: array of objects
 *      - operations: any number of functions to apply SEQUENTIALLY
 *      - Each operation takes an array and returns an array
 *      - Apply first operation to data, then second to result, etc.
 *      - Return final result
 *      - Agar data not array, return []
 *
 * Hint: HOF = functions that take functions as arguments or return functions.
 *   createFilter returns a function. applyOperations takes functions as args.
 *
 * @example
 *   const highRated = createFilter("rating", ">=", 4);
 *   highRated({ name: "Punjab Dhaba", rating: 4.5 }) // => true
 *
 *   const byRating = createSorter("rating", "desc");
 *   [{ rating: 3 }, { rating: 5 }].sort(byRating)
 *   // => [{ rating: 5 }, { rating: 3 }]
 */
export function createFilter(field, operator, value) {
  const ops = {
    '>': (a) => a > value,
    '<': (a) => a < value,
    '>=': (a) => a >= value,
    '<=': (a) => a <= value,
    '===': (a) => a === value,
  };

  if (!Object.prototype.hasOwnProperty.call(ops, operator)) {
    return () => false;
  }

  const cmp = ops[operator];
  return (obj) => cmp(obj?.[field]);
}

export function createSorter(field, order = 'asc') {
  const direction = order === 'desc' ? -1 : 1;
  return (a, b) => {
    const av = a?.[field];
    const bv = b?.[field];

    const aMissing = av === undefined || av === null;
    const bMissing = bv === undefined || bv === null;
    if (aMissing && bMissing) return 0;
    if (aMissing) return 1 * direction;
    if (bMissing) return -1 * direction;

    if (typeof av === 'number' && typeof bv === 'number') {
      return (av - bv) * direction;
    }
    return String(av).localeCompare(String(bv)) * direction;
  };
}

export function createMapper(fields) {
  return (obj) => {
    const out = {};
    for (const field of fields) {
      out[field] = obj?.[field];
    }
    return out;
  };
}

export function applyOperations(data, ...operations) {
  if (!Array.isArray(data)) return [];
  if (operations.length === 0) return data;

  return operations.reduce((acc, op) => {
    if (typeof op !== 'function') return acc;
    return op(acc);
  }, data);
}
