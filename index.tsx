import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

let mounted = false;

const renderApp = () => {
  if (mounted) return;

  let rootElement = document.getElementById('root');
  if (!rootElement) {
    rootElement = document.createElement('div');
    rootElement.id = 'root';
    document.body.appendChild(rootElement);
  }

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  mounted = true;
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp, { once: true });
} else {
  renderApp();
}
