import React, { Component, ReactNode } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router'
import { ResourceRequirementCalculator } from './ResourceRequirementCalculator'

export class ProjectRouter extends Component {
  public render(): ReactNode {
    return (
      <BrowserRouter>
        <Routes>
          <Route
            path="/faf/rr-calculator"
            element={<ResourceRequirementCalculator name="faf"/>}
          />
          <Route
            path="/bar/rr-calculator"
            element={<ResourceRequirementCalculator name="bar"/>}
          />
        </Routes>
    </BrowserRouter>
    )
  }
} 

