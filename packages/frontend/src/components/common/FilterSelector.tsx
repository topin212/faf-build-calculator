import React, { Component, ReactNode } from "react";
import {Container, Form} from 'react-bootstrap';

interface FilterSelectorProps {
  filters: Array<string>
  returnSelectedFilters: (selectedUnits: Array<string>) => void
}

interface FilterSelectorState {
  activeFilters: Map<string, boolean>
}

export class FilterSelector extends Component<FilterSelectorProps, FilterSelectorState> {
  constructor(props: FilterSelectorProps) {
    super(props)
    this.state = {
      activeFilters: new Map(props.filters.map((filter) => [filter, false]))
    }
  }

  registerFilter(previousFilters: Map<string, boolean>, newFilter: string, isChecked: boolean): FilterSelectorState {
    let newFilters = previousFilters.set(newFilter, isChecked)
    this.setState({
      activeFilters: newFilters
    })
    let selectedFilters = Array.from(newFilters.entries())
      .filter(([k, v]) => v)
      .map(([k, v]) => k)
      .reduce((acc, v) => acc.concat([v]), [])
    this.props.returnSelectedFilters(selectedFilters)
    return {activeFilters: newFilters};
  }
  
  render(): ReactNode {
    return (
      <Container>
        <Form>
          {this.props.filters.map(filter => 
            (
              <Form.Check 
                type = 'checkbox'
                id = {filter}
                key = {filter}
                label = {filter}
                onChange={(event) => {
                  this.setState((s) => 
                    this.registerFilter(s.activeFilters, filter, event.target.checked)
                )}}
              />
            )
          )}
        </Form>
      </Container>
    )
  }
}