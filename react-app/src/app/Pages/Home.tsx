import React from 'react';
import { Button } from '@ra-proj/shared';

export function Home() {
  return (
    <div>
      <h2>Home Page</h2>
      <p>Welcome to the home page!</p>
      <Button onClick={() => alert('Hello from shared button!')}>Click me</Button>
    </div>
  );
}
