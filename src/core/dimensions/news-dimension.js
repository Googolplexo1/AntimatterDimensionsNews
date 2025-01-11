import { DC } from "../constants";

import { DimensionState } from "./dimension";

export function buySingleNewsDimension(tier) {
  const dim = NewsDimension(tier);
  if (Currency.paperclips.value.lt(dim.cost)) return false;
  Currency.paperclips.subtract(dim.cost);
  dim.amount = dim.amount.plus(1);
  dim.bought += 1;
  dim.cost = dim.nextCost(dim.bought);
  return true;
}

export function resetNewsDimensions() {
  for (const dim of NewsDimensions.all) dim.amount = new Decimal(dim.bought);
  player.news.specialTickerData.ascensions++;
}

export function buyMaxNewsDimension(tier, portionToSpend = 1) {
  const canSpend = Currency.paperclips.value.times(portionToSpend);
  const dim = NewsDimension(tier);
  if (canSpend.lt(dim.cost)) return false;
  const bulk = bulkBuyBinarySearch(canSpend, {
    costFunction: bought => dim.nextCost(bought),
    cumulative: true,
    firstCost: dim.cost,
  }, dim.bought);
  if (!bulk) return false;
  Currency.paperclips.subtract(bulk.purchasePrice);
  dim.amount = dim.amount.plus(bulk.quantity);
  dim.bought += bulk.quantity;
  dim.cost = dim.nextCost(dim.bought);
  return true;
}

export function maxAllNewsDimensions() {
  // Try to buy single from the highest affordable new dimensions
  for (let i = 4; i > 0 && NewsDimension(i).bought === 0; i--) {
    buySingleNewsDimension(i);
  }

  // Buy everything costing less than 1% of initial EP
  for (let i = 4; i > 0; i--) {
    buyMaxNewsDimension(i, 0.01);
  }

  // Loop buying the cheapest dimension possible; explicit infinite loops make me nervous
  const purchasableDimensions = NewsDimensions.all;
  for (let stop = 0; stop < 1000; stop++) {
    const cheapestDim = purchasableDimensions.reduce((a, b) => (b.cost.gte(a.cost) ? a : b));
    if (!buySingleNewsDimension(cheapestDim.tier, true)) break;
  }
}

export function boostMultiplier() {
  return Decimal.pow(1.5, player.news.specialTickerData.boosts);
}

class NewsDimensionState extends DimensionState {
  constructor(tier) {
    super(() => player.news.specialTickerData.dimensions, tier);
    const BASE_COSTS = [null, 1, 10, 1000, 1000000];
    this._baseCost = BASE_COSTS[tier];
    const COST_MULTS = [null, 3, 4, 5, 6];
    this._costMultiplier = COST_MULTS[tier];
  }

  /** @returns {Decimal} */
  get cost() {
    return this.data.cost;
  }

  /** @param {Decimal} value */
  set cost(value) { this.data.cost = value; }

  nextCost(bought) {
    return Decimal.pow(this.costMultiplier, bought).times(this.baseCost);
  }

  get isAvailableForPurchase() {
    return this.isAffordable;
  }

  get isAffordable() {
    return Currency.paperclips.gte(this.cost);
  }

  get multiplier() {
    return boostMultiplier().times(Decimal.pow(2, NewsDimension(this._tier).bought));
  }

  get productionPerSecond() {
    return this.amount.times(this.multiplier);
  }

  get rateOfChange() {
    const tier = this._tier;
    if (tier === 4) {
      return DC.D0;
    }
    const toGain = NewsDimension(tier + 1).productionPerSecond;
    const current = Decimal.max(this.amount, 1);
    return toGain.times(10).dividedBy(current);
  }

  get isProducing() {
    return this.amount.gt(0);
  }

  get baseCost() {
    return this._baseCost;
  }

  get costMultiplier() {
    return this._costMultiplier;
  }

  static get dimensionCount() { return 4; }
}

/**
 * @function
 * @param {number} tier
 * @return {NewsDimensionState}
 */
export const NewsDimension = NewsDimensionState.createAccessor();

export const NewsDimensions = {
  /**
   * @type {NewsDimensionState[]}
   */
  all: NewsDimension.index.compact(),

  speed() {
    return NewsDimension(1).productionPerSecond.div(Decimal.pow(10, player.news.specialTickerData.ascensions)).clampMax(100).toNumber();
  },

  capReached() {
    return this.speed() === 100;
  },

  tick(diff) {
    for (let tier = 4; tier > 1; tier--) {
      NewsDimension(tier).produceDimensionsRealTime(NewsDimension(tier - 1), diff);
    }
  }
};
