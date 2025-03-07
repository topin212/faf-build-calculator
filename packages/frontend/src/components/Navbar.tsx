import React, { Component } from "react";
import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";

export class NavigationBar extends Component {
  render() {
    return (
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="#home">Utilities</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav">Toggle</Navbar.Toggle>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <NavDropdown title="FAF" id="basic-nav-dropdown">
                <NavDropdown.Item href="/faf/build-calculator">
                  Build calculator
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/faf/rr-calculator">
                  Resource requirement calculator
                </NavDropdown.Item>
                <NavDropdown.Item href="/faf/upgrade-calculator">
                  Upgrade calculator
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="BAR" id="basic-nav-dropdown">
                <NavDropdown.Item href="/bar/build-calculator">
                  Build calculator
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/bar/rr-calculator">
                  Resource requirement calculator
                </NavDropdown.Item>
                <NavDropdown.Item href="/bar/upgrade-calculator">
                  Upgrade calculator
                </NavDropdown.Item>
              </NavDropdown>

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}
