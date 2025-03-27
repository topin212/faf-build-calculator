import { EconomyValue, getZeroCost } from '../Typings';

export interface SpendingRate {
  time: number
  rate: EconomyValue
  energyPerMass: number
}

const safeDivision = (a: number, b: number) => 
  b !== 0? Math.round(a/b * 100) / 100 : Infinity 


export function getSpendingRate(
  cost: EconomyValue,
  production: EconomyValue, 
  additionalBuildpower = 0): SpendingRate {
    let time = cost.buildpower / (production.buildpower + additionalBuildpower)
    let massRate = safeDivision(cost.mass, time);
    let energyRate = safeDivision(cost.energy, time)
    let buildpowerRate = safeDivision(cost.buildpower, time);
    return {
      time,
      rate: {
        mass:       massRate,
        energy:     energyRate,
        buildpower: buildpowerRate,
      },
      energyPerMass: safeDivision(energyRate, massRate)
    }
}

export function getZeroSpendingRate() {
  return {
    time: 0,
    rate: getZeroCost()
  }
}



export function secondsToHumanReadableString(seconds: number): string {
  if (seconds < 1) {
    return "less than a second"
  }

  let resultingString = ""

  let secondsInDay = 24 * 60 * 60
  if (seconds > secondsInDay)
    if (seconds % secondsInDay)
      resultingString += `${seconds % 60 * 60} days`
  

  let secondsInHour = 60 * 60
  if (seconds > secondsInHour)
    if (seconds % secondsInHour)
      resultingString += `${seconds % 60 * 60} hours`
  if (seconds > 60)
    if (seconds % 60)
      resultingString += `${seconds % 60} minutes`

  if (seconds < 60)
    resultingString += `${seconds} seconds`

  return resultingString
}