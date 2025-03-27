import React, { Component, ReactNode } from "react";
import { UnitDefinition, getName } from '../../mocks/UnitDefinition';
import { Card } from 'react-bootstrap'
import { FilterSelector } from "./FilterSelector";

interface UnitListProps {
  units: Array<UnitDefinition>
}

interface UnitListState {
  filters: Array<string>
}

export class UnitList extends Component<UnitListProps, UnitListState>{

  constructor(props: UnitListProps) {
    super(props)
    this.state = {
      filters: []
    }
  }

  setFilters(newFilters: Array<string>) {
    this.setState({filters: newFilters})
  }

  render(): ReactNode {
    let units = this.props.units;

    let filtered = units
      .filter(unit => this.state.filters
        .some(filter => unit.tags
          .includes(filter)))

    return (
      filtered.map((unit) => (
        <Card style={{ width: '18rem', padding: "5px  "}}>
        <Card.Body>
          <Card.Title>{unit.name}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{getName(unit)}</Card.Subtitle>
          <Card.Text>
            {unit.description}
          </Card.Text>
        </Card.Body>
      </Card>
      ))
    )
  }
}