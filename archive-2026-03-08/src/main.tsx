import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles.css';

if (import.meta.env.DEV) {
  void import('@21st-extension/toolbar')
    .then(({ initToolbar }) => {
      initToolbar({ plugins: [] });
    })
    .catch(() => {
      // Toolbar is optional during local development.
    });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Theme appearance="light" accentColor="teal" grayColor="slate" radius="large" scaling="100%">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Theme>
  </React.StrictMode>
);
