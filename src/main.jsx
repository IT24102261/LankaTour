import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

function App() {
  return (
    <main className="app-shell">
      <section className="intro">
        <p className="eyebrow">LankaTour</p>
        <h1>Plan bright, effortless trips across Sri Lanka.</h1>
        <p>
          Your project structure is ready. Start building routes, guides, and
          travel experiences from here.
        </p>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
