import { EconomyValue, Tiers, Types, shortTierName } from "./Typings"

export function getName (unit: UnitDefinition): string {
  return `${unit.faction} ${shortTierName(unit.tier)} ${unit.type} ${unit.name}`
}

export function getShortUnitName(unit: UnitDefinition): string {
  return `${shortTierName(unit.tier)} ${unit.name}`
}

export interface UnitDefinition {
  name: string
  tier: Tiers
  cost: EconomyValue
  produces?: EconomyValue
  upkeep?: EconomyValue
  description?: string
  type: Array<Types>
  requirements: UnitDefinition | [UnitDefinition] | undefined
  tags: Array<string>
  faction: string
}
