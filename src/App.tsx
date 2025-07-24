import React from 'react';
import './App.css';

import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://7ba3dd399bcd09c145c91ac1ce022568@o4509714332450816.ingest.us.sentry.io/4509725614735360",
  
  release: "1.0.0",
  
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
  
  integrations: [
    Sentry.replayIntegration(),
    Sentry.browserTracingIntegration(),
    Sentry.feedbackIntegration({
      // The SDK will automatically create a button and inject it into the DOM
      // You can also customize the button appearance
      colorScheme: "system",
      showBranding: true,
      // You can customize the form fields
      formTitle: "Send us feedback",
      formButtonLabel: "Send feedback",
      // You can add custom fields
      additionalFields: [
        {
          type: "text",
          name: "user_type",
          label: "User Type",
          required: false,
        },
      ],
    }),
  ],

  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
  // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost" ],
});

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={() => {throw new Error("What's happening!");}}>Click me</button>;
      </header>
    </div>
  );
}

export default App;
