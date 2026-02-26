import React from 'react';

export function About() {
  return (
    <div className="home-container">
      <h2>About This Site</h2>
      <p>
        This website is a demonstration of a monorepo setup using <strong>Nx</strong>{' '} 
        and <strong>React</strong>. It is designed as a showcase for technical portfolios.
      </p>
      <p>
        The project demonstrates:
      </p>
      <ul>
        <li>Modular architecture with multiple apps and shared libraries</li>
        <li>Clean, maintainable React components</li>
        <li>Routing and page structure using React Router</li>
      </ul>
      <p>
        This serves as a working example of my ability to structure and build scalable 
        frontend applications.
      </p>
    </div>
  );
}
