import { Categories } from "./GoalSelectorData";
import { EconomyValue, Tiers, Types, multiplyCost, fullTierName, FafFactions } from "./Typings";
import { UnitDefinition, getName } from './UnitDefinition';

const prices: Map<Types, EconomyValue> = new Map([
  [Types.STRUCTURE, {
    mass: 200,
    energy: 2000,
    buildpower: 1000
  }],
  [Types.LAND, {
    mass: 50,
    energy: 500,
    buildpower: 500
  }],
  [Types.AIR, {
    mass: 40,
    energy: 600,
    buildpower: 600
  }],
  [Types.NAVAL, {
    mass: 100,
    energy: 1000,
    buildpower: 1500
  }]
])

const t1MexProduction = {
  mass: 2,
  energy: 0,
  buildpower: 0
}

const t1PgenProduction = {
  mass: 0,
  energy: 20,
  buildpower: 0
}

const t1FactoryProduction = {
  mass: 0,
  energy: 0,
  buildpower: 100
}

function adjustTierCost(cost: EconomyValue, tier: Tiers) : EconomyValue {
  return multiplyCost(cost, tier)
}

function randomFaction() {
  const factions = Object.values(FafFactions)
  const randomIndex = Math.floor(Math.random() * factions.length)

  return factions[randomIndex];
}

export function defineUnit(tier: Tiers, type: Types, name: string): UnitDefinition {
  let unit: UnitDefinition = {
    tier,
    type: name.includes("factory")? [Types.STRUCTURE, type] : [type],
    name,
    cost: multiplyCost(prices.get(type)!, tier),
    produces: 
      name.includes("extractor") ? multiplyCost(t1MexProduction, tier) : 
      name.includes("generator") ? multiplyCost(t1PgenProduction, tier) : 
      name.includes("factory")   ? multiplyCost(t1FactoryProduction, tier) : 
      name.includes("engineer")  ? multiplyCost(t1FactoryProduction, 0.5 * tier) : 
      undefined,
    requirements: undefined, 
    description: "unit description",
    tags: [],
    faction: randomFaction()
  }
  unit.tags = [fullTierName(unit.tier)].concat(unit.type).concat(unit.produces? ["Economy"] : []).concat([unit.faction])

  return unit;
}

export const UnitDatabase = [
    defineUnit(Tiers.TIER1, Types.LAND, "factory")
  , defineUnit(Tiers.TIER1, Types.AIR, "factory")
  , defineUnit(Tiers.TIER1, Types.NAVAL, "factory")

  , defineUnit(Tiers.TIER2, Types.LAND, "factory")
  , defineUnit(Tiers.TIER2, Types.AIR, "factory")
  , defineUnit(Tiers.TIER2, Types.NAVAL, "factory")

  , defineUnit(Tiers.TIER3, Types.LAND, "factory")
  , defineUnit(Tiers.TIER3, Types.AIR, "factory")
  , defineUnit(Tiers.TIER3, Types.NAVAL, "factory")
  
  , defineUnit(Tiers.TIER1, Types.STRUCTURE, "mass extractor")
  , defineUnit(Tiers.TIER1, Types.STRUCTURE, "generator")

  , defineUnit(Tiers.TIER2, Types.STRUCTURE, "mass extractor")
  , defineUnit(Tiers.TIER2, Types.STRUCTURE, "generator")


  , defineUnit(Tiers.TIER1, Types.LAND, "tank")
  , defineUnit(Tiers.TIER1, Types.LAND, "engineer")

  , defineUnit(Tiers.TIER1, Types.AIR, "fighter")
  , defineUnit(Tiers.TIER1, Types.NAVAL, "frigate")

  , defineUnit(Tiers.TIER2, Types.LAND, "tank")
  , defineUnit(Tiers.TIER2, Types.AIR, "fighter")
  , defineUnit(Tiers.TIER2, Types.NAVAL, "frigate")

  , defineUnit(Tiers.TIER1, Types.STRUCTURE, "emp")
  , defineUnit(Tiers.TIER1, Types.STRUCTURE, "nuke")
  , defineUnit(Tiers.TIER1, Types.STRUCTURE, "arty")
]
