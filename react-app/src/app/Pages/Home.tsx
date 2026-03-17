import '@styles/home-styles.css';
//import '../styles/home-styles.css';

export function Home() {
  return (
    <div className="home-page">
      <div className="home-container">
        <h2>Welcome to my Home Page</h2>
        <p>
          This is my personal web app showcasing full-stack projects built with
          React and a Node.js backend using Express.
        </p>
        <p>
          Explore interactive dashboards including a Music library, Weather
          updates, and more through the navigation bar at the top right.
        </p>
      </div>
    </div>
  );
}
