import React, {Component, ReactNode} from 'react'
import { EconomyValue } from '../../../mocks/Typings';
import { Container } from 'react-bootstrap'


interface EconomyDisplayProps {
  tooltip: string,
  displayValue: EconomyValue
}

export class EconomyDisplay extends Component<EconomyDisplayProps> {
  render(): ReactNode {
    return (
      <Container>
        {
          this.props.displayValue
          ?
            <Container>
            <p>{this.props.tooltip}</p>
            <p>Mass: {this.props.displayValue.mass}</p>
            <p>Energy: {this.props.displayValue.energy}</p>
            <p>Buildpower: {this.props.displayValue.buildpower}</p>
            </Container>
          : "no units selected"
        }
        
      </Container>
    )
  }
}