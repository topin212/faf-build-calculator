import React, { Component, ReactNode } from "react";
import { EconomyValue } from "../../../mocks/Typings";
import {
  SpendingRate,
  getSpendingRate,
  secondsToHumanReadableString,
} from "../../../mocks/economy/SpendingRate";
import { Container, Button, Form, Row, Col } from "react-bootstrap";
import { EconomySimulator, SimulationStateStep } from "../../../mocks/economy/Simulator";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

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
    };
  }

  updateStateKey(key: string, value: number) {
    this.setState((prev) => {
      let stateCopy = structuredClone(prev);
      stateCopy[key] = value;
      return stateCopy;
    });
  }

  render(): ReactNode {
    let spendingRate = 
      getSpendingRate(
        this.props.actualCost, 
        this.props.production)

    let simulator: EconomySimulator = new EconomySimulator(
      this.props.actualCost, 
      this.props.production, 
      {
        mass: this.state.initialMassStore, 
        energy: this.props.actualCost.energy, 
        buildpower: this.state.buildpower
      },
    false, 
    this.state.resolution)
    simulator.prepareSimulation();
    simulator.simulate();
    // console.table(simulator.getLastSimulationResults())
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
            <p>{`energy per mass: ${spendingRate.energyPerMass}`}</p>

            <Button>Visualize</Button>
          </Col>
          <Col>
            <Line
              datasetIdKey="123"
              data = {{
                labels  : [1,2,3,4,5,6,7,8,9,10],
                datasets: [
                  {
                    label: 'Mass Store',
                    borderColor: "green",
                    data: simulator.getLastSimulationResults().map(step => step.resourceStorage.mass)
                  },
                  {
                    label: 'Energy Store',
                    borderColor: "yellow",
                    data: simulator.getLastSimulationResults().map(step => step.resourceStorage.energy)
                  },
                  {
                    label: 'Mass Cost',
                    borderColor: "darkgreen",
                    data: simulator.getLastSimulationResults().map(step => step.costSatisfaction.mass)
                  },
                  {
                    label: 'energy cost',
                    borderColor: "orange",
                    data: simulator.getLastSimulationResults().map(step => step.costSatisfaction.energy)
                  }
                ]
              }}>

            </Line>
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
              onChange={(e) => {
                let value = parseInt(e.target.value, 10)

                this.updateStateKey(
                  "initialMassStore",
                  value == 100? this.props.actualCost.mass : value * 10
                )
                }
              }
            />
            <Form.Select
              onChange={(e) =>
                this.updateStateKey(
                  "resolution",
                  parseInt(e.target.value, 10)
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
      </Container>
    );
  }
}
