import '@styles/about-styles.css';

export function About() {
  return (
    <div className="about-container">
      <h2>About This Site</h2>

      <p>
        This website is a demonstration of a{' '}
        <strong>full-stack monorepo</strong> architecture built using{' '}
        <strong>Nx</strong>, <strong>React</strong>, and{' '}
        <strong>Node.js</strong>. It serves as a technical portfolio project
        showcasing modular design, API integrations, and scalable
        frontend-backend separation.
      </p>

      <p>This project includes:</p>

      <ul>
        <li>
          A <strong>Music Analytics Dashboard</strong> that consumes data from
          the <strong>Spotify API</strong>, processes album and track data
          through a backend service layer, and visualizes insights using{' '}
          <strong>Recharts</strong>.
        </li>

        <li>
          A <strong>Weather Search Dashboard</strong> that retrieves real-time
          weather data from the <strong>OpenWeather API</strong> via a secure
          backend integration.
        </li>

        <li>
          A <strong>Contact Page</strong> with full-stack email functionality
          powered by the <strong>Resend API</strong>, handled securely through
          the backend.
        </li>

        <li>
          A modular backend built with <strong>Express</strong> that manages API
          communication, data transformation, and secure handling of external
          services.
        </li>

        <li>
          Shared libraries for reusable utilities, type definitions, and service
          abstraction across applications within the monorepo.
        </li>
      </ul>

      <p>
        This application demonstrates clean separation of concerns: the frontend
        focuses on presentation and user interaction, while the backend manages
        API communication, data validation, and external service integrations.
        The application is deployed with a production-ready backend and
        frontend, demonstrating CI/CD considerations, environment configuration,
        and secure API key handling. Interactive elements such as responsive
        charts, dropdown menus, and dynamically updated dashboards enhance the
        user experience while maintaining a consistent design language. It also
        highlights practical considerations when working with third-party APIs,
        including rate limits, incomplete datasets, and external service
        reliability.
      </p>

      <p>
        Overall, this project reflects my ability to design and implement
        scalable, maintainable <strong>full-stack applications</strong> within a
        structured monorepo environment.
      </p>
    </div>
  );
}
