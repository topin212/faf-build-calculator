import {cartesian} from './Util'
import {Tiers} from './Typings'

export const mockFactories: Array<String> = cartesian(
    Object.values(Tiers),
    ["Land", "Air", "Naval"],
    ["Factory"]
  ).map(unitNameArray => unitNameArray.join(" "))

export const mockUnits: Array<String> = cartesian(
  Object.values(Tiers),
  ["tank", "plane", "whatever", "sub"]
  ).map(internalArray => internalArray.join(" "))
export const mockStructures: Array<String> = ["nuke", "arty", "emp"]

export const mockCategories = ["Factories", "Units", "Structures"]
export enum Categories {
  FACTORIES="Factories",
  UNITS="Units",
  STRUCTURES="Structures"
}

export const mockGoalSelectorData = new Map([
  [Categories.FACTORIES, mockFactories],
  [Categories.UNITS, mockUnits],
  [Categories.STRUCTURES, mockStructures]
])

