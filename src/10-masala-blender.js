/**
 * 🌶️ Masala Spice Blender - Function Composition
 *
 * Masala factory mein spices ko process karna hai. Function composition
 * use karke chhote chhote functions ko jodke ek bada pipeline banao.
 *
 * Functions:
 *
 *   1. pipe(...fns)
 *      - Takes any number of functions
 *      - Returns a NEW function that applies them LEFT to RIGHT
 *      - pipe(f, g, h)(x) means h(g(f(x)))
 *      - Agar no functions given, return identity function (x => x)
 *
 *   2. compose(...fns)
 *      - Takes any number of functions
 *      - Returns a NEW function that applies them RIGHT to LEFT
 *      - compose(f, g, h)(x) means f(g(h(x)))
 *      - Agar no functions given, return identity function (x => x)
 *
 *   Utility functions (simple transformations):
 *
 *   3. grind(spice)
 *      - Returns: { ...spice, form: "powder" }
 *
 *   4. roast(spice)
 *      - Returns: { ...spice, roasted: true, aroma: "strong" }
 *
 *   5. mix(spice)
 *      - Returns: { ...spice, mixed: true }
 *
 *   6. pack(spice)
 *      - Returns: { ...spice, packed: true, label: `${spice.name} Masala` }
 *
 *   7. createRecipe(steps)
 *      - steps: array of step name strings, e.g., ["grind", "roast", "pack"]
 *      - Maps step names to functions: "grind"=>grind, "roast"=>roast,
 *        "mix"=>mix, "pack"=>pack
 *      - Returns a piped function that applies steps in order
 *      - Unknown step names are skipped
 *      - Agar steps empty or not array, return identity function
 *
 * Hint: pipe and compose are the building blocks of functional programming.
 *   pipe uses reduce left-to-right, compose uses reduceRight.
 *
 * @example
 *   const process = pipe(grind, roast, pack);
 *   process({ name: "Garam" })
 *   // => { name: "Garam", form: "powder", roasted: true, aroma: "strong", packed: true, label: "Garam Masala" }
 *
 *   const recipe = createRecipe(["grind", "pack"]);
 *   recipe({ name: "Haldi" })
 *   // => { name: "Haldi", form: "powder", packed: true, label: "Haldi Masala" }
 */
export function pipe(...fns) {
  const onlyFns = fns.filter((fn) => typeof fn === 'function');
  if (onlyFns.length === 0) return (x) => x;
  return (input) => onlyFns.reduce((acc, fn) => fn(acc), input);
}

export function compose(...fns) {
  const onlyFns = fns.filter((fn) => typeof fn === 'function');
  if (onlyFns.length === 0) return (x) => x;
  return (input) => onlyFns.reduceRight((acc, fn) => fn(acc), input);
}

export function grind(spice) {
  return {
    ...(spice && typeof spice === 'object' ? spice : {}),
    form: 'powder',
  };
}

export function roast(spice) {
  return {
    ...(spice && typeof spice === 'object' ? spice : {}),
    roasted: true,
    aroma: 'strong',
  };
}

export function mix(spice) {
  return {
    ...(spice && typeof spice === 'object' ? spice : {}),
    mixed: true,
  };
}

export function pack(spice) {
  const base = spice && typeof spice === 'object' ? spice : {};
  return {
    ...base,
    packed: true,
    label: `${base.name} Masala`,
  };
}

export function createRecipe(steps) {
  if (!Array.isArray(steps) || steps.length === 0) return (x) => x;

  const stepMap = {
    grind,
    roast,
    mix,
    pack,
  };

  const fns = steps.map((s) => stepMap[s]).filter((fn) => typeof fn === 'function');

  if (fns.length === 0) return (x) => x;
  return pipe(...fns);
}
