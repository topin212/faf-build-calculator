import React, { Component, ReactNode } from "react";
import { Container, Row, Col, ListGroup, Button, Tabs, Tab, Card, CardGroup } from "react-bootstrap";
import { Categories } from '../../mocks/GoalSelectorData';
import { UnitDefinition, getName } from "../../mocks/UnitDefinition";
import { FilterSelector } from "./FilterSelector";
import { allFilters } from "../../mocks/Typings";
import { UnitList } from './UnitList'; 
import { UnitDatabase } from "../../mocks/UnitData";

interface GoalSelectorProps {
  units: Array<UnitDefinition>,
  returnSelectedUnits: (selectedUnits: Map<string, [UnitDefinition, number]>) => void
}

interface GoalSelectorState {
  selectedUnits: Map<string, [UnitDefinition, number]>
  activeFilters: Array<string>
}



function updateSelectedFilters(newFilters: Array<string>, previousState?: GoalSelectorState): GoalSelectorState {
  return {
    selectedUnits:  previousState.selectedUnits? previousState.selectedUnits : new Map(),
    activeFilters: newFilters
  }
}


export class GoalSelector extends Component<GoalSelectorProps, GoalSelectorState> {
  constructor(props: GoalSelectorProps) {
    super(props);
    this.state = {
      selectedUnits: new Map(),
      activeFilters: []
    }
  }

  public setFilters(selectedFilters: Array<string>) {
    this.setState((s) =>
      updateSelectedFilters(selectedFilters, s))
  }

  updateSelectedUnits(newUnit: UnitDefinition) {
    let previousState = this.state;
    let newMap = structuredClone(previousState.selectedUnits);
    let unitName = getName(newUnit)
    
    let newState = {
      selectedUnits:  newMap.has(unitName)
        ? newMap.set(unitName, [newUnit, previousState.selectedUnits.get(unitName)[1] + 1])
        : newMap.set(unitName, [newUnit, 1]),
        activeFilters: previousState.activeFilters
    }

    this.props.returnSelectedUnits(newState.selectedUnits)
    this.setState(newState);
  }
  

  public render(): ReactNode {
    let units = this.props.units;

    let filtered = units
      .filter(unit => this.state.activeFilters
        .every(filter => unit.tags
          .includes(filter)))

    return (
      <Container>
        <Row>
          <Col xs={2}>
            Select desired filters:
          </Col>
          <Col>
            Unit list: 
          </Col>
        </Row>
        <Row>
          <Col xs={2}>
            <FilterSelector 
              filters={allFilters} 
              returnSelectedFilters={(selectedFilters) => this.setFilters(selectedFilters)} />
          </Col>
          <Col>
            <Container fluid>
              <Row xs={1} md={4} className="g-8">
                {(
                  filtered.map((unit, index) => (
                    <Col key={index} margin="5px">
                      <Card>
                        <Card.Body>
                          <Card.Title>{unit.name}</Card.Title>
                          <Card.Subtitle className="mb-4 text-muted">{getName(unit)}</Card.Subtitle>
                          <Card.Text>
                            {unit.description}
                          </Card.Text>
                          <Button onClick={() => this.updateSelectedUnits(unit)}>Select</Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))
                )}
              </Row>
            </Container>
          </Col>
        </Row>
        
        
        {/* <Row>
          <Col>Select category:</Col>
          <Col>Select unit:</Col>
          <Col>Selected units:</Col>
        </Row>
        <Row>
          <Col> 
            <ListGroup>
              <ListGroup.Item action key={Categories.FACTORIES} onClick={() => this.setState((s,p) => updateSelectedCategory("Factories", s))}>
                {Categories.FACTORIES}
              </ListGroup.Item>
              <ListGroup.Item action key={Categories.UNITS} onClick={() => this.setState((s,p) => updateSelectedCategory("Units", s))}>
                {Categories.UNITS}
              </ListGroup.Item>
              <ListGroup.Item action key={Categories.STRUCTURES} onClick={() => this.setState((s,p) => updateSelectedCategory("Structures", s))}>
                {Categories.STRUCTURES}
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col>
            <ListGroup>
              {
                this.props.unitData.get(this.state? this.state.selectedCategory : Categories.FACTORIES).map(unit => (
                  <ListGroup.Item action onClick={() => 
                    this.setState((s) =>
                      {
                        let newState = updateSelectedUnits(unit, s)
                        this.props.returnSelectedUnits(newState.selectedUnits)
                        return newState
                      }
                    )}>
                    {getName(unit)}
                  </ListGroup.Item>))
              }
            </ListGroup>
          </Col>
          <Col>
              <ListGroup>
              {
                this.state && this.state.selectedUnits.size > 0
                  ? Array.from(this.state.selectedUnits).map((unit) => (
                    <ListGroup.Item>
                      {unit[0]} x{unit[1][1]}
                    </ListGroup.Item>))
                  : "Please select a unit"
              }
              </ListGroup>
          </Col>
        </Row> */}
      </Container>
    );
  }
}