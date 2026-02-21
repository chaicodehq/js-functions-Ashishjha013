/**
 * 🍱 Mumbai Tiffin Service - Plan Builder
 *
 * Mumbai ki famous tiffin delivery service hai. Customer ka plan banana hai
 * using destructuring parameters aur rest/spread operators.
 *
 * Functions:
 *
 *   1. createTiffinPlan({ name, mealType = "veg", days = 30 })
 *      - Destructured parameter with defaults!
 *      - Meal prices per day: veg=80, nonveg=120, jain=90
 *      - Agar mealType unknown hai, return null
 *      - Agar name missing/empty, return null
 *      - Return: { name, mealType, days, dailyRate, totalCost }
 *
 *   2. combinePlans(...plans)
 *      - Rest parameter! Takes any number of plan objects
 *      - Each plan: { name, mealType, days, dailyRate, totalCost }
 *      - Return: { totalCustomers, totalRevenue, mealBreakdown }
 *      - mealBreakdown: { veg: count, nonveg: count, ... }
 *      - Agar koi plans nahi diye, return null
 *
 *   3. applyAddons(plan, ...addons)
 *      - plan: { name, mealType, days, dailyRate, totalCost }
 *      - Each addon: { name: "raita", price: 15 }
 *      - Add each addon price to dailyRate
 *      - Recalculate totalCost = new dailyRate * days
 *      - Return NEW plan object (don't modify original)
 *      - addonNames: array of addon names added
 *      - Agar plan null hai, return null
 *
 * Hint: Use { destructuring } in params, ...rest for variable args,
 *   spread operator for creating new objects
 *
 * @example
 *   createTiffinPlan({ name: "Rahul" })
 *   // => { name: "Rahul", mealType: "veg", days: 30, dailyRate: 80, totalCost: 2400 }
 *
 *   combinePlans(plan1, plan2, plan3)
 *   // => { totalCustomers: 3, totalRevenue: 7200, mealBreakdown: { veg: 2, nonveg: 1 } }
 */
export function createTiffinPlan({ name, mealType = 'veg', days = 30 } = {}) {
  const rates = {
    veg: 80,
    nonveg: 120,
    jain: 90,
  };

  if (typeof name !== 'string' || name.length === 0) return null;
  if (!Object.prototype.hasOwnProperty.call(rates, mealType)) return null;
  if (!Number.isFinite(days) || days <= 0) return null;

  const dailyRate = rates[mealType];
  const totalCost = dailyRate * days;

  return {
    name,
    mealType,
    days,
    dailyRate,
    totalCost,
  };
}

export function combinePlans(...plans) {
  if (plans.length === 0) return null;

  const mealBreakdown = {};
  let totalRevenue = 0;

  for (const plan of plans) {
    const mealType = plan && typeof plan.mealType === 'string' ? plan.mealType : 'unknown';
    mealBreakdown[mealType] = (mealBreakdown[mealType] ?? 0) + 1;

    if (plan && Number.isFinite(plan.totalCost)) {
      totalRevenue += plan.totalCost;
    }
  }

  return {
    totalCustomers: plans.length,
    totalRevenue,
    mealBreakdown,
  };
}

export function applyAddons(plan, ...addons) {
  if (!plan || typeof plan !== 'object') return null;

  const addonNames = [];
  const totalAddonPerDay = (Array.isArray(addons) ? addons : []).reduce((sum, addon) => {
    if (!addon || typeof addon !== 'object') return sum;
    if (typeof addon.name === 'string') addonNames.push(addon.name);
    if (!Number.isFinite(addon.price)) return sum;
    return sum + addon.price;
  }, 0);

  const dailyRate = (Number.isFinite(plan.dailyRate) ? plan.dailyRate : 0) + totalAddonPerDay;
  const days = Number.isFinite(plan.days) ? plan.days : 0;
  const totalCost = dailyRate * days;

  return {
    ...plan,
    dailyRate,
    totalCost,
    addonNames,
  };
}
