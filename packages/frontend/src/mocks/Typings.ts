export enum Tiers {
  TIER1 = 1
  , TIER2
  , TIER3
  , TIER4
}

export function fullTierName(tier: Tiers): string {
  return "Tier " + tier
}

export function shortTierName(tier: Tiers): string {
  return "T" + tier
}

export enum Types {
  LAND = "Land"
  , AIR = "Air"
  , NAVAL = "Naval"
  , STRUCTURE = "Structure"
}

export enum BarFactions {
  COR = "Cortex"
  , ARM = "Armada"
}

export enum FafFactions {
  UEF = "UEF"
  , CYBRAN = "Cybran"
  , SERAPHIM = "Seraphim"
  , AEON = "Aeon"
}

export enum Resource {
  MASS = "Mass"
  , ENERGY = "Energy"
  , BUILDPOWER = "Buildpower"
}

export const allFilters: Array<string> =
  Object.keys(Tiers)
    .map(k => Tiers[k])
    .filter((key) => !Number.isNaN(parseInt(key, 10)))
    .map(tier => fullTierName(tier))
    .concat(Object.values(Types))
    .concat(Object.values(FafFactions))

export interface EconomyValue {
  mass: number
  energy: number
  buildpower: number
}

export function hasValues(a: EconomyValue): boolean {
  return a.mass > 0 && a.energy > 0 && a.buildpower > 0
}

export function isCostSatisfied(a: EconomyValue): boolean {
  return a.mass <= 0 && a.energy <= 0
}

export function isNegative(a: EconomyValue): boolean {
  return a.mass <= 0 || a.energy <= 0
}

export function negate(a: EconomyValue): EconomyValue {
  return {
    mass: -a.mass,
    energy: -a.energy,
    buildpower: a.buildpower
  }
}

export function addCosts(a?: EconomyValue, b?: EconomyValue): EconomyValue {
  if (!a && !b) {
    return getZeroCost();
  }
  if (!b) {
    return a;
  }
  if (!a) {
    return b;
  }

  return {
    mass: a.mass + b.mass,
    energy: a.energy + b.energy,
    buildpower: a.buildpower + b.buildpower
  }
}

export function multiplyCost(a: EconomyValue | undefined, b: number): EconomyValue {
  if (!a) {
    return getZeroCost();
  }
  return {
    mass: a.mass * b,
    energy: a.energy * b,
    buildpower: a.buildpower * b
  }
}

export const getZeroCost = () => {
  return {
    mass: 0,
    energy: 0,
    buildpower: 0
  }
}
