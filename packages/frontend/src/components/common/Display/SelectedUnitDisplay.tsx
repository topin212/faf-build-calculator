import React, {Component, ReactNode} from 'react'
import { UnitDefinition, getShortUnitName } from '../../../mocks/UnitDefinition';
import { Container, ListGroup, Button } from 'react-bootstrap'

interface SelectedUnitDisplayProps {
  selectedUnits: Map<string, [UnitDefinition, number]>
  unitRemoval: (unitName) => void
}

export class SelectedUnitDisplay extends Component<SelectedUnitDisplayProps> {
  render(): ReactNode {
    return (
      <Container>
        <p>Selected units:</p>
        <ListGroup>
          {
            this.props.selectedUnits
            ? Array.from(this.props.selectedUnits.entries()).map(([unitName, [unit, number]]) => (
              <ListGroup.Item>
                {getShortUnitName(unit)} x{number}
                <Button onClick={() => this.props.unitRemoval(unitName)}>Remove</Button>
              </ListGroup.Item>
            ))
            : "no units selected"
          }
        </ListGroup>
      </Container>
    )
  }
}