import React, { Component, ReactNode } from "react";
import { EconomyValue } from "../../../mocks/Typings";
import {
  SpendingRate,
  getSpendingRate,
  secondsToHumanReadableString,
  getSpendingRateWithBuildpower,
} from "../../../mocks/economy/SpendingRate";
import { Container, Button, Form, Row, Col } from "react-bootstrap";
import {
  VictoryChart,
  VictoryLine,
  VictoryTheme,
  VictoryLegend,
} from "victory";

interface ResourceExtrapolatorProps {
  actualCost: EconomyValue;
  production: EconomyValue;
}

interface ResourceExtrapolatorState {
  buildpower: number;
  initialMassStore: number;
  resolution: number;
  // spendingRate: SpendingRate
}

/*
so for the maths here: 
imagine a function of spending mass have to include the following variables: 
mass stored, mass income, mass spending rate, mass cost

then there will be a sum going from 0 to mass cost, and every iteration the following should happen:
1. mass stored += mass income
2. mass stored -= mass spending rate
3. mass cost -= mass spending rate

time in this scenario would be the amount of "additions" it takes to get the mass cost to 0

as tipped off by chatgpt, there are 2 phases here, 1 where your metal storage is able to sustain the spending, and the second one where it is not

in that case, the idea would be to somehow track the value of mass produced


so for now the best I have is: 

time = mass cost / mass spending rate

but you can only sustain the spending rate if your mass storage is not empty

time = mass stored - mass spending rate

so I want a chart of 

y = mass storage, x equals time

and a slider for build power

if I do everything as a function of time, then it could be helpful? 

mass storage as function of time = 

m = (income - spending) * t

*/

export class ResourceExtrapolator extends Component<
  ResourceExtrapolatorProps,
  ResourceExtrapolatorState
> {
  constructor(props: ResourceExtrapolatorProps) {
    super(props);
    this.state = {
      buildpower: 0,
      initialMassStore: 0,
      resolution: 1,
      // spendingRate: getZeroSpendingRate()
    };
  }

  updateStateKey(key: string, value: number) {
    this.setState((prev) => {
      let stateCopy = structuredClone(prev);
      stateCopy[key] = value;
      return stateCopy;
    });
  }

  simulate(spending: SpendingRate): [Array<number>, Array<number>] {
    //safeguard against invalid starting data
    if (
      this.props.production.buildpower == 0 ||
      spending.time == 0 ||
      spending.rate.mass == 0 ||
      spending.rate.mass == Infinity
    ) {
      return [[], []];
    }

    //ensure that the data for the graph always has enough mass to run
    let startingStorage = this.state.initialMassStore;
    //   this.state.initialMassStore > this.props.actualCost.mass
    //     ? this.state.initialMassStore
    //     : this.props.actualCost.mass;

    //initiate the state of the simulation:
    let result = [startingStorage];
    let remainingCost = this.props.actualCost.mass;

    let resolution = this.state.resolution ? this.state.resolution : 1;

    let massIncome =
      this.props.production.mass > 0
        ? this.props.production.mass * resolution
        : 1;

    let massSpendRate = spending.rate.mass * resolution;

    let debugging = [remainingCost];
    for (let i = 1; remainingCost > 0; i++) {
      let previousMassStorage = result[i - 1];
      let newMassStorage = previousMassStorage + massIncome;

      //spending for this tick is equal
      let incomeOrRate =
        newMassStorage >= massSpendRate ? massSpendRate : newMassStorage; //should this be whatever is in the storage instead?

      let afterConsumption = newMassStorage - incomeOrRate;

      remainingCost -= incomeOrRate;
      console.log(incomeOrRate);
      debugging.push(remainingCost);
      result.push(afterConsumption);
    }
    return [result, debugging];
  }

  render(): ReactNode {
    // let spendingRate = getSpendingRate(this.props.actualCost, this.props.production, this.state.buildpower)
    let spendingRate = getSpendingRateWithBuildpower(
      this.props.actualCost,
      this.state.buildpower
    );
    return (
      <Container fluid>
        <Row>
          <Col xs={2}>
            <p>
              {`it would take ${spendingRate.time} seconds to satisfy the cost with the production rate`}{" "}
            </p>
            <p>
              {`also known as ${secondsToHumanReadableString(
                spendingRate.time
              )}`}{" "}
            </p>
            <p>{`Resulting rates are:`}</p>
            <p>{`mass: ${spendingRate.rate.mass}`}</p>
            <p>{`energy: ${spendingRate.rate.energy}`}</p>
            <p>{`buildpower: ${spendingRate.rate.buildpower}`}</p>
            <Button>Visualize</Button>
          </Col>
          <Col>
            <VictoryChart colorScale={"cool"} theme={VictoryTheme.clean}>
              <VictoryLine
                style={{
                  data: {
                    stroke: "blue",
                  },
                }}
                interpolation="linear"
                minDomain={{ y: -100, x: 0 }}
                maxDomain={{ x: 10 }}
                data={this.simulate(spendingRate)[0].map((d, i) => ({
                  x: i,
                  y: d,
                }))}
              />
              <VictoryLine
                style={{
                  data: {
                    stroke: "red",
                  },
                }}
                interpolation="linear"
                minDomain={{ y: -100, x: 0 }}
                maxDomain={{ x: 10 }}
                data={this.simulate(spendingRate)[1].map((d, i) => ({
                  x: i,
                  y: d,
                }))}
              />
              <VictoryLegend
              orientation="horizontal"
              x = {150}
              data={[
                {
                  name: "Cost",
                  symbol: {
                    fill: "red",
                  },
                },
                {
                  name: "Storage",
                  symbol: {
                    fill: "Blue",
                  },
                },
              ]}
            />
            </VictoryChart>
            <Form.Label>{`Buildpower: ${this.state.buildpower}`}</Form.Label>
            <Form.Range
              onChange={(e) =>
                this.updateStateKey(
                  "buildpower",
                  parseInt(e.target.value, 10) * 10
                )
              }
            />
            <Form.Label>{`Initial mass storage: ${this.state.initialMassStore}`}</Form.Label>
            <Form.Range
              onChange={(e) =>
                this.updateStateKey(
                  "initialMassStore",
                  parseInt(e.target.value, 10) * 10
                )
              }
            />
            <Form.Select
              onChange={(e) =>
                this.updateStateKey(
                  "resolution",
                  1 / parseInt(e.target.value, 10)
                )
              }
            >
              <option>Resolution (heavy!):</option>
              <option value="1">1x</option>
              <option value="2">2x</option>
              <option value="3">3x</option>
            </Form.Select>
          </Col>
        </Row>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <Row>
          {JSON.stringify(this.simulate(spendingRate)[0])}
          {JSON.stringify(this.simulate(spendingRate)[1])}
        </Row>
      </Container>
    );
  }
}
