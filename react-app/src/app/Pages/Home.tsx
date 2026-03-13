//import '@styles/home-styles.css'; // Need to setup config to read paths correctly after deployment
import '../styles/home-styles.css';

export function Home() {
  return (
    <div className="home-page">
      <div className="home-container">
        <h2>Welcome to my Home Page</h2>
        <p>
          This is my personal web app showcasing full-stack projects built with
          React, Node.js, and shared libraries.
        </p>
        <p>Explore the dashboards using the navigation bar at the top right.</p>
      </div>
    </div>
  );
}
