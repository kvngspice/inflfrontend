import React, { useState } from 'react';
import { Navbar, Container } from 'react-bootstrap';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Navbar expand="lg" className="mb-3">
      <Container>
        <Navbar.Brand href="/">Influencer Platform</Navbar.Brand>
        <Navbar.Toggle 
          aria-controls="basic-navbar-nav" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        />
        <Navbar.Collapse id="basic-navbar-nav" className={isMenuOpen ? 'show' : ''}>
          {/* Navigation items */}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header; 