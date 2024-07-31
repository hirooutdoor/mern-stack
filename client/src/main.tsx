import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { persistor, store } from './app/store.ts';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from './provider/ThemeProvider.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PersistGate persistor={persistor}>
      <ReduxProvider store={store}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </ReduxProvider>
    </PersistGate>
  </React.StrictMode>
);
