import { EconomyValue, getZeroCost, hasValues, addCosts, negate, isCostSatisfied, isNegative } from '../Typings';
import { SpendingRate, getSpendingRate } from './SpendingRate';

interface SimulationResult {
  resourceStorage: Array<EconomyValue>
  costSatisfaction: Array<EconomyValue>
}

export interface SimulationStateStep {
  tick: number
  resourceStorage: EconomyValue
  costSatisfaction: EconomyValue
  Δr?: EconomyValue
  note?: string
}

export class EconomySimulator {
  private defaultProduction: EconomyValue
  private spendingRate: SpendingRate
  public simulationResults: Map<string, Array<SimulationStateStep>>

  public currentSimulationTag: string;

  constructor(
    private actualCost: EconomyValue,
    private production: EconomyValue,
    private initialResourceStore: EconomyValue = getZeroCost(),
    private includeProduction: boolean = false,
    private resolution: number = 1) {
    this.defaultProduction = {
      mass: 1,
      energy: 10,
      buildpower: 1
    }
    
    this.spendingRate = this.includeProduction
      ? getSpendingRate(this.actualCost, addCosts(this.production, initialResourceStore))
      : getSpendingRate(this.actualCost, initialResourceStore)
    this.simulationResults = new Map();
  }

  /**
   * This function is designed to emulate the state of the economy at tick (tick)
   * 
   * The state of the economy at a particular tick can be defined as: 
   * (storage + income) - (newMassStorage >= massSpendRate ? massSpendRate : newMassStorage)
   * 
   * which can in essence be simplified to some Δr - either positive or negative depending on the rate of spending
   * in other words, mass storage of every step can be defined as: 
   * newStorage = currentStorage + Δr
   * 
   * where Δr can be defined as 
   * (income - spendRate)
   * 
   * so it's a progression
   * starting from 
   * 
   * latest I've done: 
   * F_{selector}=\ \operatorname{round}\left(1/(1+e^{-\frac{\left(b_{buildRate}-\ x\ \ \right)}{2}})\right)m_{income}+\ \operatorname{round}\left(1/(1+e^{-\frac{\left(x\ -\ b_{buildRate}\ \right)}{2}})\right)b_{buildRate}
   */

  /**
   * F_{select}=\operatorname{round}\left(\frac{1}{1\ +\ e^{\left(T_{threshold}\ -x\right)\ }}\right)
   * F_{selector}=\ F_{select}\left(b_{buildRate}\right)\ \ \ +\ F_{select}\left(m_{income}\right)
   * F_{select}\left(x\right)
   * F_{selectD}=\frac{e^{x\ +\ T_{threshold}}}{\left(e^{x\ }+e\right)^{2}}
   * F_{selectDD}=\ -\frac{\ \left(e^{x\ }-e\right)e^{\left(x+T_{threshold}\right)}}{\left(e^{x\ }+\ e\right)^{3}}
   * F_{selectDDD}=\ \frac{\left(e^{x}\left(e^{x\ }-4e\right)\ +\ e^{2}\right)e^{\left(x+T_{threshold}\right)}}{\left(e^{x}\ +\ e\right)^{4}}
   * F_{origin}=\ \frac{1}{1\ +\ e^{\left(T_{threshold}\ -\ x\right)\ }}
   * @returns 
   */

  startingStep(): SimulationStateStep {
    return {
      tick : 0,
      resourceStorage: this.initialResourceStore,
      costSatisfaction: this.actualCost,
    }
  }

  prepareSimulation(): string {
    this.currentSimulationTag = Math.random().toString()
    this.simulationResults.set(this.currentSimulationTag, [this.startingStep()])
    return this.currentSimulationTag
  }

  getLastSimulationResults(): Array<SimulationStateStep> {
    return this.simulationResults.get(this.currentSimulationTag)
  }
  getSimulationResultsByTag(simulationTag: string): Array<SimulationStateStep> {
    return this.simulationResults.get(simulationTag)
  }

  simulate(previousStep: SimulationStateStep = this.startingStep()): SimulationStateStep {
    //safeguard against infinite loop: 
    if (
      this.production.buildpower == 0
      || this.spendingRate.time == 0
      || this.spendingRate.rate.mass == 0
      || this.spendingRate.rate.mass == Infinity
      || this.spendingRate.rate.energy == 0
      || this.spendingRate.rate.energy == Infinity
    ) {
      return {
        tick: 0,
        resourceStorage: getZeroCost(),
        costSatisfaction: getZeroCost(),
      };
    }
    if (isCostSatisfied(previousStep.costSatisfaction)) {
      return {
        tick: previousStep.tick,
        resourceStorage: previousStep.resourceStorage,
        costSatisfaction: previousStep.costSatisfaction,
        Δr: previousStep.Δr
      }
    } else {
      //let newCost = cost - (currentStorage.mass < Math.abs(r.mass)? n)
      let currentProduction = this.includeProduction
        ? hasValues(this.production) ? this.production : this.defaultProduction
        : this.defaultProduction
      let currentStorage = addCosts(previousStep.resourceStorage, currentProduction)
      let stepNote = undefined;
      let Δr: EconomyValue = negate(this.spendingRate.rate);
      if (isNegative(Δr)) {
        // check if respective storage has enough to sustain, update Δr accordingly
        if (currentStorage.mass < Math.abs(Δr.mass) ) {
          Δr.mass = -currentStorage.mass
          // this is mass stalling, adjust energy consumption to match the mass consumption
          Δr.energy = Δr.mass * this.spendingRate.energyPerMass
          stepNote = "Mass stalled"
        }
        if (currentStorage.energy < Math.abs(Δr.energy) ) {
          Δr.energy = -currentStorage.energy
          //this is energy stalling, adjust mass consumption to match the energy consumption
          Δr.mass   = Δr.energy / this.spendingRate.energyPerMass
          stepNote = "Energy stalled" 
        }
      }
      let currentSimulationState = {
        tick: previousStep.tick + 1,
        resourceStorage: addCosts(currentStorage, Δr),
        costSatisfaction: addCosts(previousStep.costSatisfaction, Δr),
        Δr
      }
      this.simulationResults.set(this.currentSimulationTag, this.simulationResults.get(this.currentSimulationTag).concat(currentSimulationState))
      return this.simulate(currentSimulationState)
    }
  }
}