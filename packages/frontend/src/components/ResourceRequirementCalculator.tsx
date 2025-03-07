import React, { Component } from "react";
import { Container, Row, Col, ListGroup, Collapse } from "react-bootstrap";

import { GoalSelector } from "./common/GoalSelector";
import { mockGoalSelectorData } from "../mocks/GoalSelectorData";
import { UnitDatabase } from "../mocks/UnitData";
import { UnitDefinition } from "../mocks/UnitDefinition";
import {
  addCosts,
  EconomyValue,
  getZeroCost,
  multiplyCost,
} from "../mocks/Typings";

import { EconomyDisplay } from './common/Display/EconomyDisplay'
import { SelectedUnitDisplay } from './common/Display/SelectedUnitDisplay' 
import { s, S } from "react-router/dist/development/fog-of-war-Cm1iXIp7";
import { ResourceExtrapolator } from "./common/Display/ResourceExtrapolator";

interface RRCalculatorProperties {
  name: string;
}

interface RRCalculatorState {
  selectedUnits: Map<string, [UnitDefinition, number]>;
  costs: EconomyValue;
  production: EconomyValue;
}

export class ResourceRequirementCalculator extends Component<
  RRCalculatorProperties,
  RRCalculatorState
> {
  constructor(props: RRCalculatorProperties) {
    super(props);
    this.state = {
      selectedUnits: new Map(),
      costs: getZeroCost(),
      production: getZeroCost()
    }
  }
  public setSelectedUnits(
    selectedUnits: Map<string, [UnitDefinition, number]>
  ) {
    let totalCost = getZeroCost();
    let units = structuredClone(selectedUnits);
    units.forEach(([unit, amount]) => {
      totalCost = addCosts(totalCost, multiplyCost(unit.cost, amount));
    });

    let totalProduction = Array.from(units.values())
      .map(([unit, number]) => multiplyCost(unit.produces, number))
      .reduce((acc, v) => addCosts(acc, v));

    this.setState({
      selectedUnits: units,
      costs: totalCost,
      production: totalProduction,
    });
  }

  getSelectedUnitCost(units: Array<[UnitDefinition, number]>): EconomyValue {
    return units
      .map(([unit, amount]) => multiplyCost(unit.cost, amount))
      .reduce((acc, v) => addCosts(acc, v), getZeroCost());
  }

  public render(): React.ReactNode {
    return (
      <Container>

        <Row>
          <Col>
            <SelectedUnitDisplay selectedUnits={this.state.selectedUnits}/>
          </Col>
          <Col>
            <EconomyDisplay displayValue={this.state.costs} tooltip="Total unit cost:"/>
          </Col>
          <Col>
            <EconomyDisplay displayValue={this.state.production} tooltip="Total unit production:"/>
          </Col>
        </Row>

        <Row>
          <Container fluid>
            <GoalSelector
              units={UnitDatabase}
              returnSelectedUnits={(selectedUnits) =>
                this.setSelectedUnits(selectedUnits)
              }
            />
          </Container>
        </Row>
        <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
        <Row>
          <ResourceExtrapolator actualCost={this.state.costs} production={this.state.production}/>
        </Row>
      </Container>
    );
  }
}
/*

{/* <Container>
        <Row>
          <Col>
            {this.props.name.toUpperCase()} resource calculator
          </Col>
          <Col>
            Resulting cost:
          </Col>
          <Col>
            Selected units produce:
          </Col>
        </Row>
        <Row>
          <Col>
            <GoalSelector 
              units = {UnitDatabase}
              returnSelectedUnits={(selectedUnits => this.setSelectedUnits(selectedUnits))}/>
          </Col>
          <Col>
            <Container>
            {this.state && this.state.costs? 
              (
                `
                mass: ${this.state.costs.mass}
                energy: ${this.state.costs.energy}
                buildpower: ${this.state.costs.buildpower}
                `
                
              ) : "no units selected"}
            </Container>
            {this.state && this.state.production? 
              (
                `
                mass: ${this.state.production.mass}
                energy: ${this.state.production.energy}
                buildpower: ${this.state.production.buildpower}
                `
                
              ) : "no units selected"}
          </Col>
        </Row>
      </Container> */
